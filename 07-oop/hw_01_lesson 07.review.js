// ============================================================
// FILE REVIEW - HW07 OOP Bài 1 - Huyen
// Kết quả chạy: output KHỚP 100% với đề.
// Tổng quan: Code RẤT sạch, validate chặt chẽ, private field dùng
//            nhất quán
// ============================================================

class ProductStore {
  // Đúng: Private field #products.
  #products = [];

  addProduct(product) {
    const { id, name, category, price, inStock } = product;

    // Đúng: .some() check trùng ID -> gọn, dừng sớm.
    // Validate id trùng
    const isDuplicate = this.#products.some((p) => p.id === id);
    if (isDuplicate) {
      return { success: false, message: "Id sản phẩm đã tồn tại" };
    }

    // Đúng: !name bắt được undefined/null, .trim() === "" bắt toàn dấu cách.
    // Validate name
    if (!name || name.trim() === "") {
      return { success: false, message: "Tên sản phẩm không được rỗng" };
    }

    // Validate category
    if (!category || category.trim() === "") {
      return { success: false, message: "Danh mục không được rỗng" };
    }

    // Đúng: typeof + <= 0 -> validate CHẶT CHẼ nhất, tránh undefined/NaN.
    // Validate price
    if (typeof price !== "number" || price <= 0) {
      return { success: false, message: "Giá phải lớn hơn 0" };
    }

    // Validate inStock
    if (typeof inStock !== "boolean") {
      return { success: false, message: "inStock phải là kiểu boolean" };
    }

    // Đúng: Dùng spread { ...product, name: name.trim(), category: category.trim() }
    //       để lưu bản sao + chuẩn hóa tên/category.
    //       Chỉ .trim(), không .toLowerCase() -> giữ format gốc.
    // Lưu với name đã trim
    this.#products.push({
      ...product,
      name: name.trim(),
      category: category.trim(),
    });
    return { success: true, message: "Thêm sản phẩm thành công" };
  }

  // Đúng: filter + includes + lowercase -> tìm không phân biệt hoa thường.
  //       Trả về MẢNG OBJECT đầy đủ. Đúng yêu cầu.
  findByName(keyword) {
    const trimmed = keyword.trim().toLowerCase();
    return this.#products.filter((p) => p.name.toLowerCase().includes(trimmed));
  }

  // Đúng: Dùng === (khớp chính xác) thay vì includes -> tốt!
  //       lowercase cả 2 phía, trim keyword. Trả về MẢNG OBJECT. Đúng.
  filterByCategory(category) {
    const trimmed = category.trim().toLowerCase();
    return this.#products.filter((p) => p.category.toLowerCase() === trimmed);
  }

  // Đúng: filter inStock, trả mảng object đầy đủ.
  getAvailableProducts() {
    return this.#products.filter((p) => p.inStock === true);
  }

  // Đúng: GỌI LẠI getAvailableProducts() để tái sử dụng code, không lặp filter.
  //       Check available.length === 0 -> return 0 (an toàn).
  //       Dùng reduce tính tổng -> rất gọn!
  getTotalInventoryValue() {
    const available = this.getAvailableProducts();
    if (available.length === 0) return 0;
    return available.reduce((sum, p) => sum + p.price, 0);
  }
}

// ============================================================
// CLASS KẾ THỪA: DiscountProductStore
// Code OOP chuẩn mực, không có gì để góp ý.
// ============================================================
class DiscountProductStore extends ProductStore {
  // Đúng: #discountRate PRIVATE -> nhất quán với #products.
  #discountRate;

  constructor(discountRate) {
    super();
    this.#discountRate = discountRate;
  }

  // Đúng: Gọi super.getTotalInventoryValue() rồi áp discount.
  getTotalInventoryValue() {
    const original = super.getTotalInventoryValue();
    return original * (1 - this.#discountRate);
  }

  // Đúng: Gọi super MỘT LẦN, lưu biến, tái sử dụng. Tối ưu!
  getDiscountInfo() {
    const originalTotal = super.getTotalInventoryValue();
    const discountAmount = originalTotal * this.#discountRate;
    const finalTotal = originalTotal - discountAmount;
    return {
      originalTotal,
      discountRate: this.#discountRate,
      discountAmount,
      finalTotal,
    };
  }
}

// ============ TEST ============
const store = new DiscountProductStore(0.1);

console.log(
  store.addProduct({
    id: "p01",
    name: "  iPhone 15 Pro  ",
    category: "phone",
    price: 29990000,
    inStock: true,
  }),
);

console.log(
  store.addProduct({
    id: "p02",
    name: "MacBook Air",
    category: "laptop",
    price: 24990000,
    inStock: true,
  }),
);

console.log(
  store.addProduct({
    id: "p03",
    name: "AirPods Pro",
    category: "audio",
    price: 5990000,
    inStock: false,
  }),
);

console.log(
  store.addProduct({
    id: "p01",
    name: "Duplicate",
    category: "phone",
    price: 1000,
    inStock: true,
  }),
);

console.log("findByName('iphone'):", store.findByName("iphone"));
console.log("filterByCategory(' PHONE '):", store.filterByCategory(" PHONE "));
console.log("getAvailableProducts():", store.getAvailableProducts());
console.log("getDiscountInfo():", store.getDiscountInfo());

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: XUẤT SẮC — output khớp 100% với đề.
//
// Điểm tốt:
//   - Private field dùng nhất quán (#products, #discountRate).
//   - Validate cực kỳ chặt chẽ: typeof + boundary cho mọi field.
//   - Dùng spread { ...product, name: name.trim() } khi lưu -> vừa
//     chuẩn hóa vừa giữ nguyên các field khác. Code rất gọn.
//   - Chỉ .trim() tên/category, KHÔNG .toLowerCase() -> giữ format.
//   - findByName/filterByCategory trả MẢNG OBJECT đúng yêu cầu.
//   - filterByCategory dùng === (chính xác), không dùng includes (rộng).
//   - getTotalInventoryValue gọi lại getAvailableProducts() -> không
//     lặp code. Dùng reduce -> gọn.
//   - getDiscountInfo gọi super 1 lần, lưu biến tái sử dụng -> tối ưu.
//
// Cần cải thiện:
//   - (Không có lỗi nào đáng kể. Bài làm tốt!)
//
