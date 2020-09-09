export async function fetchJson(path, params) {

    // variable API_URL should be set in initialization script, see main.scala.html
    if(API_URL == null || typeof(API_URL) === 'Undefined' ) {

        return;
    }

    let url = new URL(`${API_URL}${path}`);

    // assume 'options' to be query parameters -?
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    let options = {};

    options.headers = {
                Accept: "text/json",
                "Content-Type": "text/json"
            }

    const response = await fetch(url, options);

    if(!response.ok){

        if(response.status > 399) {

            var res = await response.json();

            var tmp = {};
            tmp["response"] = res;
            tmp["invalid"] = 'Access forbidden.';

            return tmp;
        }
        else {

            throw new Error(`Response not OK (server error): ${response.status}`)
        }
    }
    // response.status was OK

    return await response.json();
}
export async function sendJson(method, path, payload = {}) {

    // variable API_URL should be set in initialization script!
    if(API_URL == null || typeof(API_URL) === 'Undefined' ) {

        console.log('BACKEND_URL was null or undefined.');

        return;
    }

    const url = `${API_URL}${path}`;

    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(payload),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        }
    });

    if(!response.ok){

        throw new Error(`Response not OK: ${response.status}`)
    }

    return await response.json();
}

export async function loadPage(page) {

    const url = `${API_URL}${page}`;

    const res = await fetch(url);

    return await res.body;
}