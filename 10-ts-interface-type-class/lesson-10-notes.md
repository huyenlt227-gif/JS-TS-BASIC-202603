## Triết lý TypeScript

Trong TypeScript, chúng ta cần mô tả hình dạng của mọi dữ liệu bằng `type` hoặc `interface`.

Nguyên tắc:

- Mọi object, hàm, và API response đều nên có hợp đồng dữ liệu được viết bằng `interface` hoặc `type`.
- “Hình dạng” của dữ liệu nghĩa là:
  - Có những field nào.
  - Mỗi field thuộc kiểu dữ liệu gì.
  - Field nào bắt buộc.
  - Field nào tùy chọn.
- Người tạo dữ liệu phải tạo đúng shape:
  - Đủ field.
  - Đúng kiểu dữ liệu.
- Người sử dụng được TypeScript đảm bảo:
  - Field nào tồn tại.
  - Field nào có thể thiếu.
  - Field đó thuộc kiểu gì.

## Interface - Bản thiết kế

Có thể tưởng tượng `interface` giống như bản thiết kế nhà:

- Kiến trúc sư vẽ bản thiết kế trước (`interface`).
- Thợ xây phải xây dựng đúng theo thiết kế (`object`/`class` phải tuân theo `interface`).
- Có thể mở rộng bản thiết kế bằng `extends`.
  - Ví dụ: thêm phòng, thêm tầng.
- Nhiều kiến trúc sư có thể đóng góp vào cùng một bản thiết kế thông qua declaration merging.

## Type Alias - Nhãn dán

`type alias` giống như một nhãn dán:

- Có thể dán nhãn lên nhiều loại dữ liệu:
  - Object.
  - String.
  - Number.
  - Function.
  - Tuple.
- Nhãn dán không thể sửa sau khi đã viết.
  - Không hỗ trợ declaration merging.
- Có thể tổ hợp nhiều kiểu dữ liệu với nhau.
  - Ví dụ: union type.

class trong TS
typescript có 1 quy tắc quan trọng: Mõi thuộc tính trong class PHẢI có giá trị trước khi object đc khởi tạo.

Optional property ?
cho pheps khai bao "Field nay co hay ko deu OK, ko can gan torng constructor"

readonly
readonly = gasn 1 laafn duy nhat(trong khai bao hoac trong constructor) sau do ko cho sua
neu sua TS se bao loi

Dấu ! (Definite assigment assertion) -> TS: Tin tôi di, field này chắc chắn sẽ có giá trị trước khi tôi dung fnos -> dù bây giờ chưa thấy gán ở đâu

constructor()
paramater properites = shorthand
co the khai bao + gan thuoc tinh chi trong 1 dong

Default Parameters
-> cho phép gán sẵn giá trị mặc dịnh cho tham số - nếu new Ko truyền .TS tựk lấy giá trị mặc định

Access modifiers - phan quyen truy cap

- public - mac dinh . khong gioi han: doc duoc sua duoc, goi duoc tu bat cu cho nao - torng ngoafi clas, hay tu class con

private - chir trong class
danh dau thuoc tinh chi truy cap tu ben trong chinhc lass do. code ben ngoai va class con ko dung toi duoc
day la cong cu de dong goi: dau giu lieu nhay cam

protected - Class + class con
nam giua public va private- > thanh vien danh dau proteected -> truy cap dc trng class va moi class con ke thua no./ nhung van dong kin voiu the gioi ben ngoai

//RETURN TYPE: kieu tra ve
TS se can khai bao ro method se tra ve kieu gif TS se kiem tra banj giu loi hua do hay ko


//STATIC METHOD VA PROPERTIES

Binh thuong moi object (instance) co ban sao rieng cua propertyy va method. Nhung doi khi can thu gi do chung cho tat ca. thuoc ve class chu ko thuoc ve object nao ca

