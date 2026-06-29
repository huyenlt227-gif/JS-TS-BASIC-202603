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

type AppConfig = typeof APP_CONFIG;
type ConfigSection = keyof AppConfig;
type SelectorKey = keyof typeof APP_CONFIG.selectors;
type TimeoutKey = keyof typeof APP_CONFIG.timeouts;
type Role = (typeof APP_CONFIG.roles)[keyof typeof APP_CONFIG.roles];

function getConfigValue<S extends ConfigSection, K extends keyof AppConfig[S]>(
  section: S,
  key: K,
): AppConfig[S][K] {
  return APP_CONFIG[section][key];
}

function getSelector(key: SelectorKey): string {
  return APP_CONFIG.selectors[key];
}

function getTimeout(key: TimeoutKey): number {
  return APP_CONFIG.timeouts[key];
}

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

const ORDER_STATUS = {
  pending: "pending",
  paid: "paid",
  cancelled: "cancelled",
  refunded: "refunded",
} as const;

type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
type SortDirection = "asc" | "desc";

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

function getField<T, K extends keyof T>(item: T, key: K): T[K] {
  return item[key];
}

function pickFields<T, K extends keyof T>(item: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    result[key] = item[key];
  }

  return result;
}

function updateField<T, K extends keyof T>(item: T, key: K, value: T[K]): T {
  return {
    ...item,
    [key]: value,
  };
}

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

function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const groupKey = String(item[key]);

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }

    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function createIndex<T, K extends keyof T>(items: T[], key: K): Record<string, T> {
  return items.reduce((acc, item) => {
    const indexKey = String(item[key]);
    acc[indexKey] = item;
    return acc;
  }, {} as Record<string, T>);
}

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
