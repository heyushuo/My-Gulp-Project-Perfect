var gulp = require('gulp');

var concat        = require('gulp-concat');//合并插件
var cleanCss      = require('gulp-clean-css');//css文件压缩 
var uglify        = require('gulp-uglify');  //js压缩插件
var less          = require('gulp-less');////对less文件进行编译
var imagemin      = require('gulp-imagemin');//图片压缩
var autoprefixer  = require('gulp-autoprefixer');//自动添加浏览器兼容后缀
var open          = require('gulp-open');//自动打开页面
var connect       = require('gulp-connect');//开启本地服务
var del           = require('del');//删除文件//var clean= require('gulp-clean');//删除文件
var rev           = require('gulp-rev');//文件名加md5
var rev1          = require('gulp-asset-rev');//文件名加md5
var revCollector  = require('gulp-rev-collector');
var runSequence   = require('run-sequence');
//定义目录路径
var app = {
    //源代码，文件目录
    srcPath: 'src/',
    //文件整合之后的目录
    //项目，发布目录上产部署
    prdPath: 'dist/'
};

//所有使用的js插件存放位置
gulp.task('lib',function(){
    gulp.src(app.srcPath + 'lib/**/*')//读取这个文件夹下边的所有的文件或者文件夹
    .pipe(gulp.dest(app.prdPath + 'lib'))//读取完整后进行操作  西安拷贝到整合目录 并重命名，在拷贝到生产目录并重命名
    .pipe(connect.reload());  //文件更改后自动变异 并执行启动服务重新打开浏览器
});
//html文件需要拷贝到  prdPath中
gulp.task('html',function(){
    gulp.src(['dist/rev/rev-manifest.json','src/index.html'])//读取这个文件夹下边的所有的文件或者文件夹的html文件
    .pipe(revCollector({
    	replaceReved:true
    }))
    .pipe(gulp.dest(app.prdPath))//读取完整后进行操作  西安拷贝到整合目录 并重命名，在拷贝到生产目录并重命名
    .pipe(connect.reload());  //文件更改后自动变异 并执行启动服务重新打开浏览器
});
//将 index.less 文件 拷贝到  prdPath中，index.less引入了所有的其他的less
gulp.task('less',function(){
    gulp.src(app.srcPath + 'less/**/*.less')
    .pipe(less())
    .pipe(autoprefixer('last 2 versions','>5%'))//加前缀
    .pipe(gulp.dest(app.srcPath + 'css'))
    .pipe(cleanCss())
    .pipe(rev())
    .pipe(gulp.dest(app.prdPath + 'css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(app.prdPath + 'rev/css'))
    .pipe(connect.reload())
});

// 拷贝 js 文件  将所有的源文件中的js 文件整合成index.js 然后拷贝过去
gulp.task('script',function(){
    gulp.src(app.srcPath + 'js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
//  .pipe(rev())
    .pipe(gulp.dest(app.prdPath + 'js'))
//  .pipe(rev.manifest())
//  .pipe(gulp.dest(app.prdPath + 'rev'))
    .pipe(connect.reload());
});

//拷贝 压缩 图片 最后放到发布目录下
gulp.task('img',function(){
    gulp.src(app.srcPath + 'img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(app.prdPath+'img'))//将源图片放到整合目录下，在压缩放到生产目录下
    .pipe(connect.reload());
});


//清除旧文件，每次更新的时候
//当css，img，js出现删除操作的时候，虽然watch会监听，但是并不会删除相应文件。

//现在实现clean任务，执行任务前先删除一次build目录。
gulp.task('clean',function(){
//  gulp.src(app.prdPath+'**/*')
//  .pipe(clean());
	return del(['./dist']);
})
//总的方法
gulp.task('build',['clean'],function(){
	//回调函数,先执行clean,在执行回调函数
	runSequence(['less'],['img'], ['script'],  ['lib'], ['html'])
//	gulp.start('img', 'script', 'less', 'html', 'lib');
});


//编写服务
gulp.task('serve',['build'], function() {
    connect.server({
        root: '',//服务起来的入口
        livereload: true,//文件更改后自动刷新页面
        port: 1234       //端口号
    });
//  open('http://localhost:1234');// 在 命令工具中执行 gulp serve  就相当于是启动了服务 自动打开浏览器
    gulp.watch('src/**/*' , ['lib']);//我们希望更改了文件，就自动编译，并且打包等然后打开浏览器
    gulp.watch(app.srcPath + 'js/**/*.js', ['script']);//监听 src 下边的 js 文件，并执行 script 方法
    gulp.watch(app.srcPath + '**/*.html', ['html']);
    gulp.watch(app.srcPath + 'less/**/*.less', ['less']);
    gulp.watch(app.srcPath + 'img/**/*', ['img']);
    //这样文件变更了就会自动构建
});


//默认执行的任务，直接 执行 gulp 变行了。都编写完成后再终端 执行 gulp 便可以了。
gulp.task('default', ['serve']);



