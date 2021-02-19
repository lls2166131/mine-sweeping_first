// 将雷插入页面
const writeHtml = (map) => {
    let x = e('.gameBox')
    for (let i = 0; i < map.length; i++) {
        x.innerHTML += `<ul class="row x-${i}" data-x="${i}"></ul>`
    }

    let y = el('.row')
    for (let i = 0; i < y.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            let m = map[i][j]
            if (m === 0) {
                m = ''
            }
            y[i].innerHTML += `
                <li class="col y-${j} num-${m}" data-y="${j}">
                    <span>${m}</span>
                    <img src="imgs/flag.svg" class="img-flag hide">
                </li>
            `
        }
    }
}

//test
// writeHtml(map)



//随机生成颜色
const randomColor = () => {
    let r = Math.floor(Math.random() * 256)
    let g = Math.floor(Math.random() * 256)
    let b = 210
    return `rgba(${r},${g},${b},0.6)`
}
//判断是否胜利
const changeClearMineNum = (clearMineNum) => {
    if (clearMineNum === ((col * row) - num)) {
        let all = el('.col')
        let allNum = 0
        let stop = setInterval(function () {
            all[allNum].children[0].style.opacity = '0'
            all[allNum].children[1].style.opacity = '0'
            all[allNum].style.background = randomColor()
            allNum++
            if (allNum === all.length) {
                clearInterval(stop)
                if (zz === 0) {
                    alert('你排完所有雷了')
                    initializeGame(row, col, num)
                }
                initializeGame(row, col, num)
            }
        }, 20)
    }
}

//扫雷过程
//选中open
//选择后背景色变白
const open = (x, y)=> {
    if (x < row && y < col && x >= 0 && y >= 0) {
        let cell = e(`.x-${x}`).children[y]
        if (cell.style.background !=='white') {
            cell.style.background = 'white'
            cell.children[0].style.opacity = '1'
            cell.children[1].classList.add('hide')
            clearMineNum++
            //判断是否排完
            changeClearMineNum(clearMineNum)
            // 判断是否为‘’，如果周围没有雷为0，就递归展开
            if (cell.innerText === '') {
                openAround(x, y)
            }
        }
    }
}

//自动展开周围的
const openAround = (x, y) => {
    // console.log(x, y, 'x,y');
    open(x - 1, y + 1)
    open(x - 1, y - 1)
    open(x - 1, y)
    open(x + 1, y + 1)
    open(x + 1, y - 1)
    open(x + 1, y)
    open(x, y + 1)
    open(x, y - 1)
}

//给所有的方块绑定点击事件，点击显示数字或者爆炸
const show = () => {
    let x = el('.row')
    for (let i = 0; i < x.length; i++) {
        bindEleEvent(x[i], 'click', function (event) {
            let cell = event.target
            if (cell.tagName != 'LI') {
                //事件委托
                cell = event.target.parentElement
            }
            //已经被点击过的
            let flag = cell.children[1].classList.contains('hide')
            //没有被标记，并且没有被点开
            if (cell.tagName === 'LI' && flag) {
                //如果不是雷并且没有被点开
                if (cell.children[0].innerText !== '9' && cell.style.background !== 'white') {
                    cell.children[0].style.opacity = '1'
                    cell.style.background = 'white'
                    clearMineNum++
                    changeClearMineNum(clearMineNum)
                }
                //如果是雷
                if (cell.children[0].innerText === '9') {
                    zz = 1
                    cell.classList.add('boom')
                    alert('游戏结束')
                    let all = el('.col')
                    let ff = []
                    let allNum = 0
                    //结束游戏显示所有雷
                    for (let i = 0; i < all.length; i++) {
                        if (all[i].children[0].innerText === '9') {
                            ff[allNum] = all[i]
                            allNum++
                        }
                    }
                    allNum = 0
                    let time = 60
                    //设置显示所有雷的延时
                    // if (num > 50) {
                    //     time = 10
                    // }
                    // if (num > 10) {
                    //     time = 25
                    // }
                    let stop = setInterval(function () {
                        ff[allNum].classList.add('boom')
                        allNum++
                        if (allNum === ff.length) {
                            clearInterval(stop)
                            // console.log('stop');
                        }
                    }, time)
                }
                if (cell.children[0].innerText === '') {
                    let x = parseInt(cell.parentElement.dataset.x)
                    let y = parseInt(cell.dataset.y)
                    openAround(x, y)
                }
            }
        })
    }

}

//标记雷
const addFlag = () =>{
    let x = el('.row')
    //判断雷是否被标记
    for (let i = 0; i < x.length; i++) {
        let mineNum = num
        bindEleEvent(x[i],'contextmenu', function (event) {
            event.preventDefault();
            // let btnNum = event.button
            let el = event.target
            if (el.tagName != 'LI') {
                // 事件委托
                el = event.target.parentElement
            }
            if (el.tagName === 'LI') {
                let classList = el.children[1].classList
                // 已经被点击过的地方不能标记
                if (classList.contains('hide') && el.style.background !== 'white') {
                    let residue = e('.residue')
                    if (mineNum !== 0) {
                        mineNum--
                    }
                    residue.innerText = `${mineNum}`
                    classList.remove('hide')
                } else if (el.style.background !== 'white') {
                    classList.add('hide')
                }
            }
        })
    }
}


// 4，清除画面，然后写入新的画面
let stopTime
const initializeGame = (row, col, num) => {

    let residue = e('.residue')
    residue.innerText = `${num}`
    let time = e('.tick')
    time.innerText = `0`
    let i = 1
    clearInterval(stopTime)
    stopTime = setInterval(function () {
        time.innerText = `${i++}`
    }, 1000)
    // zz
    zz = 0
    // 首先清除原来的地图，然后重新初始化
    let box = e('.gameBox')
    box.innerHTML = ''
    let body = e('body')
    body.style.minWidth = `${27 * col}px`
    let map = createMineData(row, col, num)
    writeHtml(map)
    show(row, col, num)
    addFlag()
}

// 5，选择游戏等级，给按钮绑定功能
const bindBtn = () => {
    let level = el('.choice-level')
    for (let i = 0; i < level.length; i++) {
        bindEleEvent(level[i], 'click', function (event) {
            let level = event.target.innerHTML
            if (level === '初级') {
                row = 9
                col = 9
                num = 10
                initializeGame(row, col, num)
            } else if (level === '中级') {
                row = 16
                col = 16
                num = 40
                initializeGame(row, col, num)
            } else if (level === '高级') {
                row = 16
                col = 30
                num = 99
                initializeGame(row, col, num)
            }
        })
    }
    let restart = e('.restart')
    bindEleEvent(restart,'click', function (event) {
        initializeGame(row, col, num)
    } )
}

const __main = () =>{
    bindBtn()
    initializeGame(row, col, num)
}

__main()



