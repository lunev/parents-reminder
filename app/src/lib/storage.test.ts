import { afterEach, describe, expect, it, vi, type Mock } from "vitest";
import { storage } from "./storage";

const getMock = chrome.storage.local.get as Mock;

describe("storage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("get returns the stored value for a key", async () => {
    getMock.mockResolvedValueOnce({ myKey: "myValue" });

    const result = await storage.get<string>("myKey");

    expect(chrome.storage.local.get).toHaveBeenCalledWith(["myKey"]);
    expect(result).toBe("myValue");
  });

  it("get returns null when the key is missing", async () => {
    getMock.mockResolvedValueOnce({});

    const result = await storage.get<string>("missingKey");

    expect(result).toBeNull();
  });

  it("set writes the key/value pair", async () => {
    await storage.set("myKey", { foo: "bar" });

    expect(chrome.storage.local.set).toHaveBeenCalledWith({ myKey: { foo: "bar" } });
  });

  it("remove deletes the key", async () => {
    await storage.remove("myKey");

    expect(chrome.storage.local.remove).toHaveBeenCalledWith("myKey");
  });
});
