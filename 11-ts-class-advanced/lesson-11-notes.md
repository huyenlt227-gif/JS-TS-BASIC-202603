//Abstract clas
abstract clas ton tai trong TS - no la 1 class dang dang do - co 1 phan code , nhung co 1p han chua viet (
abstrtact methods
) class con hoan thanh phan con thieu

//generic class la gi
generic class cho phép mình viết 1 class duy nhất nhưng hoạt động đc với bất kì kiểu dữ liệu nào.
gióng như khuôn bánh: 1 cái khuôn có thể làm bánh scola. báh trưng, bánh dâu.... chỉ cần thay nguyên liệu (T), khuôn giữ nguyên

//cú pháp
class ClassName<T>

T = Type Parameter (placehgolder)
//generic constraints - giới hjanj kiểu đưco phép

//Composition va inhertance has - a va is -a

///
is - a - la mot
i
nheritance (ke thua ) => class con la 1 loaij cua class cha -> ke thua moi thu
//Cau hoi dat dra : X co la 1 Y ?? -> neu nghe ty nhin -> is -a

Dog la mot ANIMAL -> Dog extends animal
LoginPage la 1 BasePage -> loginpage extends thang BasePage

/// Has -a (co 1 )
composition = class co 1 hoac su dun object khac -> chua ben torng nhu cong cu

Car La mot Dong co ko ????
student co la 1 score ko ???

CAR co 1 engine -< car chua engie ben trong
student co 1 score > student co diem so

computer co 1 cpu -> computer chua cpu

//QUY TẮC OOP. ưu tiên dùng composition hơn inheritance, trừ khi quan hệ is-a thực sự rõ ràng

Extends()
Cứng nhắc - thằng con phải kế thừa hết các thuộc rtinhs và method từ cha (kể cả những thứ ko cần)
1 cha duy nhất
khó test (phải mock cả cha)

cha đổi -> con sợ

Composition
linh hoạt chỉ chọn module nó cần
nhiều module 1 lúc
module đổi ko ảnh hưởng
dễ test (mock từng module)

Khi nào dùng kế thừa
IS-A rõ ràng, ổn định
pKo có nhu cầu da kế thừa

khi nao dùng compo

has - a
cần linh hoạtm muón tải dụng module độc lập

-> module các phần logc có khả năng tái sử dụng -> class và ịnect hau gọi composition từ đó

Dependency Injection
(fixture)
