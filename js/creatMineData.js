
let map = []
let col = 16
let row = 16
let num = 40
let zz = 0
let clearMineNum = 0
// 生成一行
const _row = (r) => {
    for (let i = 0; i < r; i++) {
        map[i] = new Array()
    }
}
// 生成行列
const _column = (col) => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < col; j++) {
            map[i][j] = 0
        }
    }
}

//给行和列生成空二维数组
const blankMap = (r, col) => {
    _row(r)
    _column(col)
}

//随机生成雷
const randomLocation = (r, col) => {
    let x = Math.floor(Math.random() * r)
    let y = Math.floor(Math.random() * col)
    if (map[x][y] !== 9) {
        map[x][y] = 9
    } else {
        randomLocation(r, col)
    }
}

//根据雷的数量循环生成雷
const writeInMine = (r, col, num) => {
    // console.log(map)
    for (let i = 0; i < num; i++) {
        // console.log(map)
        randomLocation(r, col)
    }
}

//如果雷周围的不是雷的数加一
const countLocation = (map, x, y) => {
    let row = map[0]
    let r = row.length
    let col = map.length
    if (x >= 0 && y >= 0 && (x < r) && ( y < col )) {
        let cell =  map[y][x]
        if (cell !== 9) {
            map[y][x] = cell + 1
        }

    }
}

const countAround = (map, x, y) => {
    // 左边三个
    countLocation(map, x - 1, y - 1)
    countLocation(map, x - 1, y)
    countLocation(map, x - 1, y + 1)

    // 上下两个
    countLocation(map, x, y - 1)
    countLocation(map, x, y + 1)

    // 右边三个
    countLocation(map, x + 1, y - 1)
    countLocation(map, x + 1, y)
    countLocation(map, x + 1, y + 1)
}

//统计周围雷的个数
const countMine = (map) => {
    for (let i = 0; i < map.length; i++) {
        let row = map[i]
        for (let j = 0; j < row.length; j++) {
            let cell = row[j]
            if (cell === 9) {
                countAround(map, j, i)
            }
        }
    }
}

// 生成雷数据
const createMineData = (r, col, num) => {
    // let map = []
    blankMap(r, col)
    // console.log(map)
    writeInMine(r, col, num)
    countMine(map)
    return map
}

//test
// console.log(createMineData(6, 6, 10))