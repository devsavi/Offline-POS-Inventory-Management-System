"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  // ── Products (Inventory) ───────────────────────────────────────────────────
  products: {
    getAll: () => electron.ipcRenderer.invoke("products:getAll"),
    getById: (id) => electron.ipcRenderer.invoke("products:getById", id),
    getByBarcode: (barcode) => electron.ipcRenderer.invoke("products:getByBarcode", barcode),
    search: (query) => electron.ipcRenderer.invoke("products:search", query),
    create: (data) => electron.ipcRenderer.invoke("products:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("products:update", id, data),
    delete: (id) => electron.ipcRenderer.invoke("products:delete", id),
    getLowStock: () => electron.ipcRenderer.invoke("products:getLowStock"),
    countByCategory: () => electron.ipcRenderer.invoke("products:countByCategory")
  },
  // ── Sales (Billing / POS) ──────────────────────────────────────────────────
  billing: {
    createSale: (data) => electron.ipcRenderer.invoke("billing:createSale", data),
    getAllSales: () => electron.ipcRenderer.invoke("billing:getAllSales"),
    getSaleById: (id) => electron.ipcRenderer.invoke("billing:getSaleById", id),
    updateSale: (id, data) => electron.ipcRenderer.invoke("billing:updateSale", id, data),
    deleteSale: (id) => electron.ipcRenderer.invoke("billing:deleteSale", id),
    getDailyRevenue: (days) => electron.ipcRenderer.invoke("billing:getDailyRevenue", days),
    getTopProducts: (limit) => electron.ipcRenderer.invoke("billing:getTopProducts", limit),
    getRevenueInRange: (from, to) => electron.ipcRenderer.invoke("billing:getRevenueInRange", from, to)
  },
  // ── Customers ─────────────────────────────────────────────────────────────
  customers: {
    getAll: () => electron.ipcRenderer.invoke("customers:getAll"),
    getById: (id) => electron.ipcRenderer.invoke("customers:getById", id),
    search: (query) => electron.ipcRenderer.invoke("customers:search", query),
    create: (data) => electron.ipcRenderer.invoke("customers:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("customers:update", id, data),
    delete: (id) => electron.ipcRenderer.invoke("customers:delete", id),
    purchaseHistory: (customerId) => electron.ipcRenderer.invoke("customers:purchaseHistory", customerId)
  },
  // ── Users / Staff ─────────────────────────────────────────────────────────
  users: {
    getAll: () => electron.ipcRenderer.invoke("users:getAll"),
    getById: (id) => electron.ipcRenderer.invoke("users:getById", id),
    create: (data) => electron.ipcRenderer.invoke("users:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("users:update", id, data),
    delete: (id) => electron.ipcRenderer.invoke("users:delete", id),
    salesSummary: () => electron.ipcRenderer.invoke("users:salesSummary")
  },
  // ── Assets ────────────────────────────────────────────────────────────────
  assets: {
    getAll: () => electron.ipcRenderer.invoke("assets:getAll"),
    getById: (id) => electron.ipcRenderer.invoke("assets:getById", id),
    create: (data) => electron.ipcRenderer.invoke("assets:create", data),
    update: (id, data) => electron.ipcRenderer.invoke("assets:update", id, data),
    delete: (id) => electron.ipcRenderer.invoke("assets:delete", id),
    getWarrantyExpiringSoon: (withinDays) => electron.ipcRenderer.invoke("assets:getWarrantyExpiringSoon", withinDays),
    getByStatus: (status) => electron.ipcRenderer.invoke("assets:getByStatus", status)
  },
  // ── Settings ──────────────────────────────────────────────────────────────
  settings: {
    get: () => electron.ipcRenderer.invoke("settings:get"),
    update: (data) => electron.ipcRenderer.invoke("settings:update", data),
    setAdminPasswordHash: (hash) => electron.ipcRenderer.invoke("settings:setAdminPasswordHash", hash)
  }
});
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
