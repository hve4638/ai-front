"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FetchContainer {
    #nextFetchId = 0;
    #fetches = {};
    fetch(url, init) {
        const [fetchId, fetchData] = this.#createFetchData();
        fetchData.promise = fetch(url, {
            ...init,
            signal: fetchData.abortController.signal
        });
        return fetchId;
    }
    abort(fetchId) {
        const fetchData = this.#fetches[fetchId];
        if (fetchData) {
            fetchData.abortController.abort();
        }
    }
    async get(fetchId) {
        const fetchData = this.#fetches[fetchId];
        if (fetchData) {
            try {
                const res = await fetchData.promise;
                return this.#parseResponse(res);
            }
            catch (error) {
                return this.#parseError(error);
            }
            finally {
                this.#removeFetchData(fetchId);
            }
        }
        else {
            throw new Error("No fetch data");
        }
    }
    #createFetchData() {
        const fetchId = this.#nextFetchId++;
        const fetchData = {
            promise: null,
            abortController: new AbortController(),
        };
        this.#fetches[fetchId] = fetchData;
        return [fetchId, fetchData];
    }
    #removeFetchData(fetchId) {
        delete this.#fetches[fetchId];
    }
    #parseResponse(res) {
        return {
            error: false,
            ok: res.ok,
            status: res.status,
            statusText: res.statusText,
            data: res.text(),
        };
    }
    #parseError(error) {
        try {
            return {
                error: true,
                ok: false,
                errorMessage: error.message,
                errorName: error.name,
                data: null,
            };
        }
        catch (error) {
            return {
                error: true,
                ok: false,
                errorMessage: "Unknown error",
                errorName: "UnknownError",
            };
        }
    }
}
exports.default = FetchContainer;
