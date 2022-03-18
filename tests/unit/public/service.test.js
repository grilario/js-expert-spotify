import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import Service from "../../../public/controller/js/service.js";

describe("#Services", () => {
  test("Make request", async () => {
    const url = "http://localhost:3000"
    const service = new Service({ url })
    const data = "zum"
    const header = {
      method: "POST",
      body: JSON.stringify(data),
    }

    const toJson = jest.fn().mockReturnValue({ result: "ok"})
    global.fetch = jest.fn().mockResolvedValue({ json: toJson })

    const result = await service.makeRequest(data)

    expect(result).toStrictEqual({ result: "ok"})
    expect(global.fetch).toHaveBeenCalledWith(url, header)
    expect(toJson).toHaveBeenCalled()
  })
})