var empty = [1,2,null];

function isEmpty(i){
    return i === null;
}

console.log([1,2,null].filter(isEmpty))