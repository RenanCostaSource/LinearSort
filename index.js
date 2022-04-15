const fs = require('fs');
const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const algorithm = 0; // change this if you want to change the sort type 0 = counting | 1 = radix | 1 = bucket

//Just change the name of the file to change the test case
const file = fs.readFileSync('num.1000.1.in', 'utf-8');
const array = file.split('\n').map(it => {
    return Number.parseInt(it);
}).filter(it => {
    return it !== undefined;
});
array.shift()
let auxMax = Number.NEGATIVE_INFINITY
let auxMin = Number.POSITIVE_INFINITY
array.forEach(number => {
    if (number < auxMin) {
        auxMin = number
    }
    if (number > auxMax) {
        auxMax = number
    }
})
const min = auxMin
const max = auxMax
//does not work if max >= 4294_967_295
function countingSort(arr, min, max) {
    let i = min,
        j = 0,
        len = arr.length,
        count = [];
    for (i = min; i <= max; i++) {
        count[i] = 0;
    }
    for (i = 0; i < len; i++) {
        count[arr[i]] += 1;
    }
    for (i = min; i <= max; i++) {
        while (count[i] > 0) {
            arr[j] = i;
            j++;
            count[i]--;
        }
    }
    return arr;
};
//######### RADIX ################
function getDigit(num, place) {
    let posOrNeg = num > 0 ? 1 : -1
    return posOrNeg * (Math.floor(Math.abs(num) / Math.pow(10, place)) % 10)
}
function digitCount(num) {
    if (num === 0) return 1
    return Math.floor(Math.log10(Math.abs(num))) + 1
}
function mostDigits(nums) {
    let maxDigits = 0
    for (let i = 0; i < nums.length; i++) {
        maxDigits = Math.max(maxDigits, digitCount(nums[i]))
    }
    return maxDigits
}
function radixSort(arrOfNums) {
    let maxDigitCount = mostDigits([max, min])
    for (let k = 0; k < maxDigitCount; k++) {
        let digitBuckets = Array(20).fill(null).map(() => Array())
        for (let i = 0; i < arrOfNums.length; i++) {
            let digit = getDigit(arrOfNums[i], k)
            if (!Object.is(NaN, digit)) {
                digitBuckets[digit + 9].push(arrOfNums[i])
            }
        }
        // New order after each loop
        arrOfNums = [].concat(...digitBuckets)
    }
    return arrOfNums
}
//################################
//######### BUCKET SORT ################
function bucketSort(arr) {
    if (arr.length === 0) {
        return arr;
    }
    let i,
        minValue = arr[0],
        maxValue = arr[0],
        bucketSize = 1000;
    arr.forEach(function (currentVal) {
        if (currentVal < minValue) {
            minValue = currentVal;
        } else if (currentVal > maxValue) {
            maxValue = currentVal;
        }
    })
    let bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    let allBuckets = Array(bucketCount).fill(null).map(() => Array());
    for (i = 0; i < allBuckets.length; i++) {
        allBuckets[i] = [];
    }
    arr.forEach(currentVal => {
        if (!Object.is(NaN, Math.floor((currentVal - minValue) / bucketSize))) {
            allBuckets[Math.floor((currentVal - minValue) / bucketSize)].push(currentVal);
        }
    });
    arr.length = 0;
    allBuckets.forEach(function (bucket) {
        insertion(bucket);
        bucket.forEach(function (element) {
            arr.push(element)
        });
    });
    return arr;
}
const insertion = arr => {
    let length = arr.length;
    let i, j;
    for (i = 1; i < length; i++) {
        let temp = arr[i];
        for (j = i - 1; j >= 0 && arr[j] > temp; j--) {
            arr[j + 1] = arr[j];
        }
        arr[j + 1] = temp;
    }
    return arr;
};
//######################################
const timeStart = performance.now();
let sorted = []
switch (algorithm) {
    case 1: {
        sorted = radixSort(array)
        break;
    }
    case 2: {
        sorted = bucketSort(array)
        break;
    }
    default: {
        sorted = countingSort(array, min, max)
    }
}
const timeEnd = performance.now();

//validates
let worked = true;
for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i] > sorted[i + 1]) {
        worked = false;
    }
}
console.log("it worked? " + worked);
console.log("time spent:" + (timeEnd - timeStart));



process.exit(1);
