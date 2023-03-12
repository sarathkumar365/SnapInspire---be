module.exports = function catchAsyncErrors(promise) {
    // Promise.allSetteled will return  an array of objects, we grab the first one
    // THe object will only ever have one of these properties   
    // value - resolved data
    // and
    // reason - the rejected error

    return Promise.allSettled([promise]).then(function([{value, reason}]) {
        return [value, reason]
    })
}

module.exports = async function asyncWrap(promise) {
    try{
        const data = await promise
        return [data,undefined]
    } catch (error) {
        return [undefined,error]
    }
}