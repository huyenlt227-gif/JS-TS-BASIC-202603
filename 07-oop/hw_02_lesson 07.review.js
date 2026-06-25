// ============================================================
// FILE REVIEW - HW07 OOP Bài 2 - Huyen
// Kết quả chạy: output KHỚP 100% với đề.
// Tổng quan: Code sạch, logic đúng
// ============================================================

class Cart {
  // Đúng: Cả #items và #discountRate đều private.
  #items = [];
  #discountRate = 0;

  // Đúng: Tạo helper _setDiscountRate(rate) cho class con dùng.
  //       Class con không cần biết #discountRate là gì, chỉ cần gọi
  //       method này. Rất đúng tinh thần đóng gói!
  //       (Dùng _ ở đầu tên là convention "đây là method nội bộ")
  // Method nội bộ cho phép class con gọi để đặt discount
  _setDiscountRate(rate) {
    this.#discountRate = rate;
  }

  addItem(item) {
    const { name, price, quantity } = item;

    // Đúng: Validate !name bắt undefined/null, .trim() bắt toàn dấu cách.
    //       Có message rõ ràng cho từng trường hợp.
    // Validate name
    if (!name || name.trim() === "") {
      return { success: false, message: "Tên sản phẩm không được rỗng" };
    }

    // Đúng: typeof + <= 0 -> validate chặt chẽ.
    // Validate price
    if (typeof price !== "number" || price <= 0) {
      return { success: false, message: "Giá phải lớn hơn 0" };
    }

    // Validate quantity
    if (typeof quantity !== "number" || quantity <= 0) {
      return { success: false, message: "Số lượng phải lớn hơn 0" };
    }

    const trimmedName = name.trim();

    // Đúng: Dùng .find() tìm item trùng tên (so sánh lowercase) -> gọn.
    //       Nếu có -> cộng quantity. Nếu không -> push mới.
    //       Lưu name đã .trim() (giữ nguyên hoa thường, chỉ bỏ dấu cách).
    // Nếu tên đã tồn tại (không phân biệt hoa thường) -> tăng quantity
    const existing = this.#items.find(
      (i) => i.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.#items.push({ name: trimmedName, price, quantity });
    }

    return { success: true, message: "Thêm vào giỏ hàng thành công" };
  }

  // Đúng: removeItem chuẩn hóa tên + so sánh lowercase -> xóa được.
  removeItem(name) {
    const trimmed = name.trim().toLowerCase();
    this.#items = this.#items.filter((i) => i.name.toLowerCase() !== trimmed);
  }

  // Đúng: Dùng reduce tính tổng price * quantity. Gọn.
  getSubtotal() {
    return this.#items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  // Đúng: trim + toUpperCase code -> không phân biệt hoa thường/dấu cách.
  //       Set #discountRate, return true/false. Đúng yêu cầu.
  applyCoupon(code) {
    const normalized = code.trim().toUpperCase();
    if (normalized === "SALE10") {
      this.#discountRate = 0.1;
      return true;
    }
    if (normalized === "SALE20") {
      this.#discountRate = 0.2;
      return true;
    }
    return false;
  }

  // Đúng: checkout tính subtotal -> discount -> total.
  // Đúng: items dùng .map(i => ({ ...i })) để trả BẢN SAO, không phải
  //       tham chiếu gốc. Đây là điểm rất tinh tế — người ngoài không
  //       thể sửa giỏ hàng qua object checkout trả về.
  checkout() {
    const subtotal = this.getSubtotal();
    const discount = subtotal * this.#discountRate;
    const total = subtotal - discount;
    return {
      items: this.#items.map((i) => ({ ...i })),
      subtotal,
      discount,
      total,
    };
  }
}

// ============================================================
// CLASS KẾ THỪA: VipCart
// Code sạch, logic override đúng chuẩn.
// ============================================================
class VipCart extends Cart {
  // Đúng: #memberName private.
  #memberName;

  constructor(memberName) {
    super();
    this.#memberName = memberName;
  }

  // Đúng: Gọi super.applyCoupon(code) trước để thử SALE10/SALE20.
  //       Nếu super OK -> return true. Nếu không -> kiểm tra VIP30.
  //       Dùng this._setDiscountRate(0.3) thay vì chọc trực tiếp
  //       private field. Rất đúng OOP!
  applyCoupon(code) {
    // Thử mã thường trước
    const result = super.applyCoupon(code);
    if (result) return true;

    // Nếu mã thường không hợp lệ, kiểm tra mã VIP
    if (code.trim().toUpperCase() === "VIP30") {
      this._setDiscountRate(0.3);
      return true;
    }

    return false;
  }

  // Đúng: Gọi super.checkout() lấy hóa đơn gốc, spread thêm
  //       memberName và cartType. Rất gọn.
  checkout() {
    const baseResult = super.checkout();
    return {
      ...baseResult,
      memberName: this.#memberName,
      cartType: "VIP",
    };
  }
}

// ============ TEST ============
const cart = new VipCart("Neko");

console.log(
  cart.addItem({ name: "Trà sữa trân châu", price: 30000, quantity: 2 }),
);

console.log(
  cart.addItem({ name: "  trà SỮA trân châu  ", price: 30000, quantity: 1 }),
);

console.log(cart.addItem({ name: "Trà đào", price: 25000, quantity: 1 }));

console.log("applyCoupon(' vip30 '):", cart.applyCoupon(" vip30 "));

console.log("checkout():", cart.checkout());

// ============================================================
// TỔNG HỢP REVIEW — BÀI 2
// ============================================================
// Kết quả: output khớp 100% với đề.
//
// Điểm tốt:
//   - Private field dùng nhất quán (#items, #discountRate, #memberName).
//   - Helper method _setDiscountRate() -> class con không chọc private
//     field, đi qua method public. Thiết kế rất đúng OOP.
//   - addItem: validate chặt chẽ (typeof + boundary), gộp quantity
//     khi trùng tên, lưu name đã trim nhưng giữ nguyên hoa thường.
//   - removeItem: chuẩn hóa tên + so sánh lowercase -> đúng.
//   - applyCoupon: trim + toUpperCase, set discountRate, return boolean.
//   - checkout items: dùng .map(i => ({...i})) trả bản sao -> ngăn
//     người ngoài sửa giỏ hàng qua object checkout. Rất tinh tế!
//   - VipCart: override đúng, gọi super trước, dùng _setDiscountRate.
//   - Có phần phân tích cuối file -> rất có tâm, giải thích rõ ràng
//     từng method, kèm bảng test case cho tester.
//
// Cần cải thiện:
//   - (Không có lỗi nào đáng kể. Bài làm  tốt!)
//
