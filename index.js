function App() {
    this.cache = [];
    this.lastResult = 0;
}

//入栈 并缓存这些中间件
App.prototype.use = function (fn) {
    if (typeof fn !== 'function') {
        throw new Error('please use a function')
    }
    this.cache.push(fn);
    return this;
}

App.prototype.removeMW = function() {

}

//执行了next方法 将执行过的方法
App.prototype.next = function() {
    if (this.middleWares && this.middleWares.length > 0) {
        //中间件出栈
        var ware = this.middleWares.shift();
        //执行中间件
        //将App的this绑定到该方法使得next可以执行到
        //call负责绑定方法中的next参数
        //bind负责绑定App中的next方法
        ware.call(this, this.next.bind(this));
    }
}

App.prototype.handleMethods = function () {
    //将入栈的方法复制给middleWares
    this.middleWares = this.cache.map(function (fn) {
        return fn;
    })
    //开始执行
    this.next();
}

var app = new App();
app.use((next) => {
    console.log('excute a 3s delay')
    delay().then(() => {
        console.log('first middle pass')
        next()
    });
})
app.use(function(next) { 
    console.log('second middle pass')
    next();
})
app.handleMethods();


function delay() {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve(1)
        }, 3000)
    })
}