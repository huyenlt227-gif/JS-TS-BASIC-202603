// ===== BÀI 1: Quản lý kho sản phẩm Neko Shop =====

// Union type: sản phẩm chỉ thuộc 1 trong 3 loại
type LoaiSanPham = "ao" | "quan" | "phukien";

// interface mô tả hình dạng 1 sản phẩm
interface SanPham {
  ten: string;
  gia: number; // đơn vị: đồng
  tonKho: number; // số lượng còn trong kho
  loai: LoaiSanPham;
}

const khoSanPham: SanPham[] = [
  { ten: "Áo thun Neko", gia: 150000, tonKho: 12, loai: "ao" },
  { ten: "Quần Jean", gia: 350000, tonKho: 0, loai: "quan" },
  { ten: "Mũ lưỡi trai", gia: 80000, tonKho: 5, loai: "phukien" },
  { ten: "Áo khoác dù", gia: 500000, tonKho: 3, loai: "ao" },
];

// 1. Tìm sản phẩm theo tên (không phân biệt hoa thường, bỏ khoảng trắng thừa)
function timSanPham(ten: string): SanPham | undefined {
  const tenChuan = ten.trim().toLowerCase();
  for (const sp of khoSanPham) {
    if (sp.ten.toLowerCase() === tenChuan) {
      return sp;
    }
  }
  return undefined;
}

// 2. Phân loại giá
function phanLoaiGia(gia: number): string {
  if (gia < 100000) {
    return "Rẻ";
  } else if (gia < 400000) {
    return "Trung bình";
  } else {
    return "Đắt";
  }
}

// 3. Tình trạng kho
function tinhTrangKho(sp: SanPham): string {
  if (sp.tonKho === 0) {
    return "HẾT HÀNG";
  }
  return `Còn ${sp.tonKho} sản phẩm`;
}

// 4. Tổng giá trị kho (dùng for...of, cộng dồn)
function tongGiaTriKho(): number {
  let tong = 0;
  for (const sp of khoSanPham) {
    tong += sp.gia * sp.tonKho;
  }
  return tong;
}

// 5. In danh sách sản phẩm
function inDanhSach(): void {
  const tenLoai: Record<LoaiSanPham, string> = {
    ao: "Áo",
    quan: "Quần",
    phukien: "Phụ kiện",
  };

  for (const sp of khoSanPham) {
    const loai = tenLoai[sp.loai];
    const mucGia = phanLoaiGia(sp.gia);
    const tinhTrang = tinhTrangKho(sp);
    console.log(`${sp.ten} [${loai}] - ${sp.gia}d - ${mucGia} - ${tinhTrang}`);
  }
}

// --- Kiểm tra Bài 1 ---
console.log("===== BÀI 1 =====");
console.log(timSanPham("  áo THUN neko ")?.ten); // Áo thun Neko
console.log(timSanPham("không có"));              // undefined

console.log(phanLoaiGia(80000));  // Rẻ
console.log(phanLoaiGia(150000)); // Trung bình
console.log(phanLoaiGia(500000)); // Đắt

inDanhSach();
// Áo thun Neko [Áo] - 150000d - Trung bình - Còn 12 sản phẩm
// Quần Jean [Quần] - 350000d - Trung bình - HẾT HÀNG
// Mũ lưỡi trai [Phụ kiện] - 80000d - Rẻ - Còn 5 sản phẩm
// Áo khoác dù [Áo] - 500000d - Đắt - Còn 3 sản phẩm

console.log("Tổng giá trị kho:", tongGiaTriKho()); // 3700000

// ===== BÀI 2: Sổ điểm học viên Neko Academy =====

// Union type: học viên chỉ thuộc 1 trong 4 mức xếp loại
type XepLoai = "Gioi" | "Kha" | "TrungBinh" | "Yeu";

// interface mô tả 1 học viên
interface HocVien {
  readonly id: number; // không cho phép sửa sau khi tạo
  hoTen: string;
  diem: number[]; // điểm các môn
  email?: string; // optional: có thể không có
}

const danhSach: HocVien[] = [
  { id: 1, hoTen: "  nguyễn văn an ", diem: [8, 9, 7], email: "an@neko.vn" },
  { id: 2, hoTen: "Trần thị Bình", diem: [5, 6, 6] },
  { id: 3, hoTen: "LÊ VĂN CƯỜNG", diem: [3, 4, 5], email: "cuong@neko.vn" },
  { id: 4, hoTen: "Phạm Thị Dung", diem: [10, 9, 10] },
];

// 1. Chuẩn hóa tên: trim, bỏ khoảng trắng thừa giữa từ, viết hoa chữ đầu mỗi từ
function chuanHoaTen(ten: string): string {
  return ten
    .trim()
    .split(/\s+/)
    .map((tu) => tu.charAt(0).toUpperCase() + tu.slice(1).toLowerCase())
    .join(" ");
}

// 2. Điểm trung bình (dùng for...of, không dùng reduce), làm tròn 1 chữ số thập phân
function diemTrungBinh(hv: HocVien): number {
  let tong = 0;
  for (const d of hv.diem) {
    tong += d;
  }
  return parseFloat((tong / hv.diem.length).toFixed(1));
}

// 3. Xếp loại
function xepLoai(diemTB: number): XepLoai {
  if (diemTB >= 8.5) {
    return "Gioi";
  } else if (diemTB >= 6.5) {
    return "Kha";
  } else if (diemTB >= 5) {
    return "TrungBinh";
  } else {
    return "Yeu";
  }
}

// 4. Tìm học viên theo email (không phân biệt hoa thường, bỏ khoảng trắng)
function timTheoEmail(email: string): HocVien | undefined {
  const emailChuan = email.trim().toLowerCase();
  for (const hv of danhSach) {
    if (hv.email && hv.email.toLowerCase() === emailChuan) {
      return hv;
    }
  }
  return undefined;
}

// 5. In bảng điểm
function inBangDiem(): void {
  const tenXepLoai: Record<XepLoai, string> = {
    Gioi: "Giỏi",
    Kha: "Khá",
    TrungBinh: "Trung bình",
    Yeu: "Yếu",
  };

  for (const hv of danhSach) {
    const ten = chuanHoaTen(hv.hoTen);
    const tb = diemTrungBinh(hv);
    const loai = tenXepLoai[xepLoai(tb)];
    console.log(`${ten} - TB: ${tb} - ${loai}`);
  }
}

// --- Kiểm tra Bài 2 ---
console.log("\n===== BÀI 2 =====");
console.log(chuanHoaTen("  nguyễn văn an ")); // Nguyễn Văn An
console.log(chuanHoaTen("LÊ VĂN CƯỜNG"));    // Lê Văn Cường

console.log(diemTrungBinh(danhSach[1])); // 5.7

console.log(xepLoai(8)); // Kha
console.log(xepLoai(4)); // Yeu

console.log(timTheoEmail("  AN@neko.vn ")?.id); // 1
console.log(timTheoEmail("khong@co.vn"));        // undefined

inBangDiem();
// Nguyễn Văn An - TB: 8 - Khá
// Trần Thị Bình - TB: 5.7 - Trung bình
// Lê Văn Cường - TB: 4 - Yếu
// Phạm Thị Dung - TB: 9.7 - Giỏi
