function App() {
    this.cache = [];
    this.lastResult = 0;
}

App.prototype.use = function (fn) {
    if (typeof fn !== 'function') {
        throw new Error('please use a function')
    }
    this.cache.push(fn);
    return this;
}

//执行了next方法 将执行过的方法
App.prototype.next = function () {
    if (this.middleWares && this.middleWares.length > 0) {
        //获取最先入栈的方法 
        var ware = this.middleWares.shift();
        //将App的this绑定到该方法使得next可以执行到
        ware.call(this, this.next.bind(this));
    }
}

App.prototype.handleMethods = function () {
    //将入栈的方法复制给middleWares
    this.middleWares = this.cache.map(function (fn) {
        return fn;
    })
    this.next();
}

var app = new App();
app.use(function(next){console.log(1);next();})
app.use(function(next){console.log(2);next();})
app.handleMethods();