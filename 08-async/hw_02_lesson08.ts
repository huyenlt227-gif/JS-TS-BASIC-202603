export {};

// ----- DANH SÁCH CHI NHÁNH cần lấy báo cáo -----
// thanhCong = false để giả lập chi nhánh mất kết nối.
type ChiNhanhConfig = {
  ten: string;
  doanhThu: number;
  thoiGian: number;
  thanhCong: boolean;
};

type KetQuaDoanhThu = {
  chiNhanh: string;
  doanhThu: number;
};

const CHI_NHANH = [
  { ten: "Hà Nội", doanhThu: 120000000, thoiGian: 1500, thanhCong: true },
  { ten: "Đà Nẵng", doanhThu: 0, thoiGian: 2000, thanhCong: false },
  { ten: "TP.HCM", doanhThu: 250000000, thoiGian: 2500, thanhCong: true },
] satisfies ChiNhanhConfig[];

// ----- Hàm giả lập tải doanh thu 1 chi nhánh -----
function taiDoanhThuChiNhanh(
  ten: string,
  doanhThu: number,
  thoiGian: number,
  thanhCong = true
): Promise<KetQuaDoanhThu> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (thanhCong) {
        resolve({ chiNhanh: ten, doanhThu });
      } else {
        reject(`Chi nhánh ${ten} mất kết nối!`);
      }
    }, thoiGian);
  });
}

function dinhDangTien(vnd: number): string {
  return vnd.toLocaleString("vi-VN") + "đ";
}

// 1) Xếp loại if/else nhiều cấp
function xepLoai(doanhThu: number): string {
  if (doanhThu >= 200000000) {
    return "Xuất sắc";
  } else if (doanhThu >= 100000000) {
    return "Đạt chỉ tiêu";
  } else if (doanhThu > 0) {
    return "Cần cải thiện";
  } else {
    return "Không có doanh thu";
  }
}

// 2) Hàm tổng hợp
async function tongHopBaoCao() {
  console.log("Đang tổng hợp báo cáo từ các chi nhánh...");

  try {
    const ketQua = await Promise.allSettled(
      CHI_NHANH.map((cn) =>
        taiDoanhThuChiNhanh(cn.ten, cn.doanhThu, cn.thoiGian, cn.thanhCong)
      )
    );

    const dsThanhCong = ketQua
      .filter((kq): kq is PromiseFulfilledResult<KetQuaDoanhThu> => kq.status === "fulfilled")
      .map((kq) => kq.value);
    const dsThatBai = ketQua
      .filter((kq): kq is PromiseRejectedResult => kq.status === "rejected")
      .map((kq) => String(kq.reason));

    for (const loi of dsThatBai) {
      console.log(`  [LỖI] ${loi}`);
    }

    let tongDoanhThu = 0;
    let chiNhanhDanDau: KetQuaDoanhThu | null = null;

    for (const cn of dsThanhCong) {
      tongDoanhThu += cn.doanhThu;

      if (!chiNhanhDanDau || cn.doanhThu > chiNhanhDanDau.doanhThu) {
        chiNhanhDanDau = cn;
      }

      console.log(`  ${cn.chiNhanh}: ${dinhDangTien(cn.doanhThu)} - ${xepLoai(cn.doanhThu)}`);
    }

    console.log(`Tổng doanh thu: ${dinhDangTien(tongDoanhThu)}`);

    if (chiNhanhDanDau) {
      console.log(
        `Chi nhánh dẫn đầu: ${chiNhanhDanDau.chiNhanh} (${dinhDangTien(chiNhanhDanDau.doanhThu)})`
      );
    } else {
      console.log("Chi nhánh dẫn đầu: Không có dữ liệu");
    }

    // Xử lý chuỗi map + join
    const dongXepLoai = dsThanhCong
      .map((cn) => `${cn.chiNhanh} (${xepLoai(cn.doanhThu)})`)
      .join(", ");
    console.log(`Xếp loại: ${dongXepLoai || "Không có chi nhánh nào thành công"}`);

    // if/else đánh giá tổng thể theo tỉ lệ thành công
    const tongCN = CHI_NHANH.length;
    const soThanhCong = dsThanhCong.length;
    const tiLe = soThanhCong / tongCN;

    if (tiLe === 1) {
      console.log(`${soThanhCong}/${tongCN} chi nhánh thành công. Hệ thống ổn định.`);
    } else if (tiLe >= 0.5) {
      console.log(`${soThanhCong}/${tongCN} chi nhánh thành công (${tongCN - soThanhCong} gặp sự cố).`);
    } else if (soThanhCong > 0) {
      console.log(`${soThanhCong}/${tongCN} chi nhánh thành công. Cần kiểm tra hạ tầng khẩn cấp.`);
    } else {
      console.log(`0/${tongCN} chi nhánh thành công. Hệ thống gặp sự cố nghiêm trọng.`);
    }
  } catch (err) {
    // allSettled thường không vào đây, vẫn giữ try/catch đúng yêu cầu
    console.log("[LỖI HỆ THỐNG] " + err);
  } finally {
    console.log("Hoàn tất tổng hợp báo cáo.");
  }
}

// Chạy thử
tongHopBaoCao();