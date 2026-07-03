// Bài 1

// Đúng: Dùng `as const` để giữ literal type cho từng giá trị trong APP_CONFIG.
const APP_CONFIG = {
  env: {
    dev: "https://dev.neko.vn",
    staging: "https://staging.neko.vn",
    prod: "https://neko.vn",
  },
  selectors: {
    loginButton: "#login",
    cartBadge: "[data-test='cart-badge']",
    checkoutButton: "#checkout",
  },
  timeouts: {
    short: 1000,
    medium: 5000,
    long: 15000,
  },
  roles: {
    admin: "ADMIN",
    member: "MEMBER",
    guest: "GUEST",
  },
} as const;

// Đúng: AppConfig = typeof APP_CONFIG.
type AppConfig = typeof APP_CONFIG;
// Đúng: ConfigSection = keyof AppConfig.
type ConfigSection = keyof AppConfig;
// Đúng: SelectorKey = keyof typeof APP_CONFIG.selectors.
type SelectorKey = keyof typeof APP_CONFIG.selectors;
// Đúng: TimeoutKey = keyof typeof APP_CONFIG.timeouts.
type TimeoutKey = keyof typeof APP_CONFIG.timeouts;
// Đúng: Role = union các literal trong roles.
type Role = (typeof APP_CONFIG.roles)[keyof typeof APP_CONFIG.roles];

// Đúng: <S extends ConfigSection, K extends keyof AppConfig[S]> -> section và key hợp lệ.
//       Return type AppConfig[S][K] tự suy ra.
function getConfigValue<S extends ConfigSection, K extends keyof AppConfig[S]>(
  section: S,
  key: K,
): AppConfig[S][K] {
  return APP_CONFIG[section][key];
}

// Đúng: getSelector chỉ nhận SelectorKey, return string.
function getSelector(key: SelectorKey): string {
  return APP_CONFIG.selectors[key];
}

// Đúng: getTimeout chỉ nhận TimeoutKey, return number.
function getTimeout(key: TimeoutKey): number {
  return APP_CONFIG.timeouts[key];
}

// Đúng: createRoleRecord dùng Object.values + reduce để tự sinh đủ các key role.
//       Cách này tự động cập nhật nếu APP_CONFIG.roles thêm/bớt key.
function createRoleRecord<V>(defaultValue: V): Record<Role, V> {
  const roles = Object.values(APP_CONFIG.roles) as Role[];

  return roles.reduce(
    (acc, role) => {
      acc[role] = defaultValue;
      return acc;
    },
    {} as Record<Role, V>,
  );
}

// Đúng: isRole dùng Object.values để kiểm tra.
//       Có `value is Role` giúp thu hẹp kiểu khi dùng.
function isRole(value: string): value is Role {
  const roles = Object.values(APP_CONFIG.roles) as string[];
  return roles.includes(value);
}

console.log("=== Bai 1 ===");
console.log(getConfigValue("env", "dev"));
console.log(getConfigValue("timeouts", "long"));
console.log(getSelector("checkoutButton"));
console.log(getTimeout("medium"));

const permissions = createRoleRecord(false);
console.log(permissions.ADMIN);
console.log(permissions.MEMBER);
console.log(permissions.GUEST);

console.log(isRole("ADMIN"));
console.log(isRole("SUPER_ADMIN"));

// ============================================================
// TỔNG HỢP REVIEW — BÀI 1
// ============================================================
// Kết quả: ĐẠT, output khớp 100%.
//
// Điểm tốt:
//   - Dùng typeof + keyof + as const đúng để tạo các type từ APP_CONFIG.
//   - getConfigValue generic với 2 tham số S/K, return type tự suy ra.
//   - createRoleRecord dùng Object.values + reduce -> tự động cập nhật khi roles thay đổi.
//   - isRole là type guard, dùng Object.values cho gọn.
//
// ============================================================

// Bài 2

const ORDER_STATUS = {
  pending: "pending",
  paid: "paid",
  cancelled: "cancelled",
  refunded: "refunded",
} as const;

// Đúng: OrderStatus union các literal trong ORDER_STATUS.
type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
// Đúng: SortDirection union 2 giá trị.
type SortDirection = "asc" | "desc";

// Đúng: interface Order đủ field.
interface Order {
  id: string;
  customer: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  tags: string[];
}

const orders: Order[] = [
  {
    id: "o1",
    customer: "An",
    total: 450000,
    status: "paid",
    createdAt: "2026-06-01",
    tags: ["smoke", "vip"],
  },
  {
    id: "o2",
    customer: "Binh",
    total: 120000,
    status: "pending",
    createdAt: "2026-06-03",
    tags: ["new"],
  },
  {
    id: "o3",
    customer: "Cuong",
    total: 800000,
    status: "paid",
    createdAt: "2026-06-02",
    tags: ["vip"],
  },
  {
    id: "o4",
    customer: "Dung",
    total: 0,
    status: "cancelled",
    createdAt: "2026-06-04",
    tags: [],
  },
];

// Đúng: K extends keyof T, return type T[K] chính xác.
function getField<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

// Đúng: pickFields trả Pick<T, K>, không mutate object gốc.
function pickFields<T, K extends keyof T>(item: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = item[key];
  }

  return result;
}

// Đúng: updateField dùng spread + ghi đè [key] -> không mutate object gốc.
function updateField<T, K extends keyof T>(item: T, key: K, value: T[K]): T {
  return {
    ...item,
    [key]: value,
  };
}

// Đúng: sortBy copy mảng rồi sort.
// Đúng: default direction = "asc".
// Đúng: Xử lý cả number và string thông qua typeof.
function sortBy<T, K extends keyof T>(
  items: T[],
  key: K,
  direction: SortDirection = "asc",
): T[] {
  return [...items].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    const left = String(aValue);
    const right = String(bValue);

    return direction === "asc"
      ? left.localeCompare(right)
      : right.localeCompare(left);
  });
}

// Đúng: groupBy dùng reduce + check acc[groupKey] trước khi push.
//       Không crash khi nhóm nhiều item cùng key.
function groupBy<T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T[]> {
  return items.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }

      acc[groupKey].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

// Đúng: createIndex dùng reduce tạo Record<string, T> tra cứu nhanh.
function createIndex<T, K extends keyof T>(
  items: T[],
  key: K,
): Record<string, T> {
  return items.reduce(
    (acc, item) => {
      const indexKey = String(item[key]);
      acc[indexKey] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
}

// Đúng: summarizeByStatus khởi tạo đủ 4 status với count/total = 0 trước,
//       sau đó cộng dồn theo orders. Output chính xác theo đề.
function summarizeByStatus(
  orderList: Order[],
): Record<OrderStatus, { count: number; total: number }> {
  const summary: Record<OrderStatus, { count: number; total: number }> = {
    [ORDER_STATUS.pending]: { count: 0, total: 0 },
    [ORDER_STATUS.paid]: { count: 0, total: 0 },
    [ORDER_STATUS.cancelled]: { count: 0, total: 0 },
    [ORDER_STATUS.refunded]: { count: 0, total: 0 },
  };

  for (const order of orderList) {
    summary[order.status].count += 1;
    summary[order.status].total += order.total;
  }

  return summary;
}

console.log("=== Bai 2 ===");
console.log(getField(orders[0], "customer"));
console.log(pickFields(orders[0], ["id", "total"]));
console.log(updateField(orders[0], "status", ORDER_STATUS.refunded).status);
console.log(sortBy(orders, "total", "desc").map((order) => order.id));
console.log(Object.keys(groupBy(orders, "status")));
console.log(createIndex(orders, "id").o2.customer);

const summary = summarizeByStatus(orders);
console.log(summary.paid);
console.log(summary.refunded);

// ============================================================
// TỔNG HỢP REVIEW — BÀI 2
// ============================================================
// Kết quả: ĐẠT, output khớp 100% với dữ liệu hiện tại.
//
// Điểm tốt:
//   - getField, pickFields, updateField đều dùng generic đúng, return type chính xác.
//   - updateField dùng spread nên không mutate object gốc -> khớp yêu cầu "Không mutate".
//   - sortBy copy mảng rồi sort, xử lý được cả number và string, default direction = "asc".
//   - groupBy và createIndex dùng reduce gọn, không crash.
//   - summarizeByStatus khởi tạo đủ 4 status trước khi cộng dồn -> output chính xác.
//
// Cần cải thiện: Không có điểm lớn. Một vài gợi ý nhỏ để bài gọn hơn nữa:
//   - summarizeByStatus có thể sinh động từ Object.values(ORDER_STATUS) thay vì liệt kê tay:
//       const summary = {} as Record<OrderStatus, { count: number; total: number }>;
//       for (const status of Object.values(ORDER_STATUS)) {
//         summary[status] = { count: 0, total: 0 };
//       }
//     Cách này tránh phải sửa thủ công khi thêm status mới.
//
// Tổng kết: Bài làm rất tốt, nắm chắc generic, keyof, typeof, Record, Pick,
//           type guard và cách viết utility dùng lại được.
// ============================================================
