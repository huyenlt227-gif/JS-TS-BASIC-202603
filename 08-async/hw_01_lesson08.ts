export {};

// ----- KHO HÀNG: nguồn dữ liệu "API" sẽ tra cứu -----
const KHO_HANG: Record<string, { gia: number; tonKho: number }> = {
  "Áo Thun": { gia: 150000, tonKho: 10 },
  "Quần Jean": { gia: 350000, tonKho: 5 },
  "Giày Sneaker": { gia: 800000, tonKho: 3 },
  "Mũ": { gia: 90000, tonKho: 0 },
};

// ----- ĐƠN HÀNG khách nhập dạng CHUỖI -----
const donHang1 = ["  áo thun x2 ", "Quần Jean x1", "MŨ x1"];
const donHang2 = ["Áo thun x1", "Điện thoại x1"];

// ----- Hàm giả lập gọi API lấy giá + tồn kho 1 sản phẩm -----
type ThongTinSanPham = { ten: string; gia: number; tonKho: number };

function layThongTinSanPham(ten: string): Promise<ThongTinSanPham> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tt = KHO_HANG[ten];
      if (!tt) {
        reject(`Sản phẩm "${ten}" không tồn tại trong hệ thống!`);
      } else {
        resolve({ ten, ...tt });
      }
    }, 800);
  });
}

function dinhDangTien(vnd: number): string {
  return vnd.toLocaleString("vi-VN") + "đ";
}

// 1) Chuẩn hóa tên: trim + viết hoa chữ cái đầu mỗi từ
function chuanHoaTen(ten: string): string {
  return ten
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((tu: string) => tu.charAt(0).toUpperCase() + tu.slice(1))
    .join(" ");
}

// 2) Phân tích chuỗi "tên xSỐLƯỢNG" -> { ten, soLuong }
function phanTichDon(dong: string): { ten: string; soLuong: number } {
  const raw = dong.trim();
  const phan = raw.split(/x/i); // tách theo x hoặc X
  if (phan.length !== 2) {
    throw new Error(`Dòng đơn hàng không hợp lệ: "${dong}"`);
  }

  const ten = chuanHoaTen(phan[0]);
  const soLuong = Number(phan[1].trim());

  if (!Number.isFinite(soLuong) || soLuong <= 0) {
    throw new Error(`Số lượng không hợp lệ trong dòng: "${dong}"`);
  }

  return { ten, soLuong };
}

// 3) Hàm chính
async function tinhTienGioHang(donHang: string[]) {
  console.log("Bắt đầu tính tiền giỏ hàng...");

  try {
    console.log(`Phân tích ${donHang.length} dòng đơn hàng...`);
    const dsDat = donHang.map(phanTichDon);

    console.log(`Tải thông tin ${dsDat.length} sản phẩm...`);
    const dsThongTin = await Promise.all(
      dsDat.map((item: { ten: string; soLuong: number }) => layThongTinSanPham(item.ten))
    );

    // Ghép thông tin và tính thành tiền
    const chiTiet = dsDat.map((item: { ten: string; soLuong: number }) => {
      const tt = dsThongTin.find((sp) => sp.ten === item.ten)!;
      return {
        ten: item.ten,
        soLuong: item.soLuong,
        gia: tt.gia,
        tonKho: tt.tonKho,
        thanhTien: tt.gia * item.soLuong,
      };
    });

    // Lọc sản phẩm đủ hàng
    const hangHopLe = chiTiet.filter((sp: { ten: string; soLuong: number; gia: number; tonKho: number; thanhTien: number }) => {
      const duHang = sp.tonKho >= sp.soLuong;
      if (!duHang) {
        console.log(`  Bỏ "${sp.ten}" - chỉ còn ${sp.tonKho}, cần ${sp.soLuong}`);
      }
      return duHang;
    });

    // Cộng dồn tạm tính bằng for...of
    let tamTinh = 0;
    for (const sp of hangHopLe) {
      tamTinh += sp.thanhTien;
      console.log(`  ${sp.ten} x${sp.soLuong} = ${dinhDangTien(sp.thanhTien)}`);
    }

    console.log(`Tạm tính: ${dinhDangTien(tamTinh)}`);

    // if/else nhiều cấp tính ưu đãi
    let tyLeGiam = 0;
    let moTaUuDai = "không giảm";

    if (tamTinh >= 1000000) {
      tyLeGiam = 0.15;
      moTaUuDai = "giảm 15% (đơn từ 1.000.000đ)";
    } else if (tamTinh >= 500000) {
      tyLeGiam = 0.1;
      moTaUuDai = "giảm 10% (đơn từ 500.000đ)";
    } else if (tamTinh >= 200000) {
      tyLeGiam = 0.05;
      moTaUuDai = "giảm 5% (đơn từ 200.000đ)";
    }

    const soTienGiam = Math.round(tamTinh * tyLeGiam);
    const thanhTien = tamTinh - soTienGiam;

    if (soTienGiam > 0) {
      console.log(`Ưu đãi: ${moTaUuDai} -${dinhDangTien(soTienGiam)}`);
    } else {
      console.log("Ưu đãi: không có");
    }

    console.log(`Thành tiền: ${dinhDangTien(thanhTien)}`);
  } catch (err) {
    console.log("[LỖI] " + err);
  } finally {
    console.log("Kết thúc tính tiền.");
  }
}

// Chạy thử
tinhTienGioHang(donHang1).then(() => {
  console.log("\n---\n");
  return tinhTienGioHang(donHang2);
});