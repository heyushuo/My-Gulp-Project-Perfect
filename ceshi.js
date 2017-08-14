

//npm install gulp-clean gulp-concat gulp-connect gulp-cssmin gulp-imagemin gulp-less gulp-load-plugins gulp-uglify open  -—save-dev

var gulp = require('gulp');
//合并插件
var concat = require('gulp-concat');
//css文件压缩 
var cleanCss = require('gulp-clean-css');
////压缩插件
var uglify = require('gulp-uglify');
////删除debug信息
//var stripDebug = require('gulp-strip-debug');
////对less文件进行编译
var less = require('gulp-less');
//图片压缩
var imagemin = require('gulp-imagemin');
////使用gulp-autoprefixer根据设置浏览器版本自动处理浏览器前缀。使用她我们可以很潇洒地写代码，
////不必考虑各浏览器兼容前缀。【特别是开发移动端页面时，就能充分体现它的优势。例如兼容性不太好的flex布局。】
//var autoprefixer = require('gulp-autoprefixer');
////使用gulp-minify-css压缩css文件，减小文件大小，并给引用url添加版本号避免缓存。重要：gulp-minify-css已经被废弃，
////请使用gulp-clean-css，用法一致。
//var cssmin=require('gulp-clean-css');



/*雪碧图(精灵图):用到的插件     gulp-css-spriter
 * 安装命令: npm install --save-dev gulp-css-spriter
 * 引入对象
 * 目前该插件只支持 .jpg .png文件的图片
 */
var spriter = require('gulp-css-spriter');


//代码压缩合并
/* js 合并用的插件和css合并用的一样都是concat
 * js 压缩用的插件是gulp-uglify
 * 安装命令是
 * npm install --save-dev gulp-uglify
 */
gulp.task('js1',function(){
	gulp.src('src/js/*.js') //这一步拿到src/js文件下 所有的.js文件
		.pipe(concat('all.js'))//合并到一期在all.js文件
		.pipe(uglify())  //压缩js代码
		.pipe(gulp.dest('src/js/'))//最后输出到src/js文件中
});

gulp.task('concat',function(){
	gulp.src('./src/css/*.css') //选中css目录下的所有的css文件合并成all.css文件
		.pipe(concat('all.css',{newLine:'/*这里是分割线*/'}))//第二个参数newLine可选表示合并中间插入的内容
		.pipe(gulp.dest('./src/css/'))
})

/*css文件压缩 用到的插件是 gulp-clean-css
 * npm install --save-dev gulp-clean-css
 * 这里我们借用concat命令的合并css的行为，合并完后进行压缩
 * cleanCss()函数里面的参数可选 下面注释是兼容ie8 里面的参数可以查看npm官网中的 gulp-clean-css插件
 */
gulp.task('clean',function(){
	gulp.src('./src/css/*.css') 
		//.pipe(concat('style.css'))// 这里我们借用concat命令的合并css的行为，合并完后进行压缩
		.pipe(cleanCss()) //.pipe(cleanCss({compatibility: 'ie8'}))
		.pipe(gulp.dest('./src/css/'))
})

//对less进行编译
gulp.task("less",function(){
	gulp.src('./src/less/*.less') //选中less文件夹下的所有的.less文件
	  .on('error', function(err) {
            console.error('Error!', err.message);
        })
	.pipe(less()) //less()函数，使less文件编译成css文件 .pipe()就相当于下一步 之前好像已经说过了 习惯就好了
	.pipe(gulp.dest('./src/css'));//用dest函数输出到css文件夹下
})
//图片压缩
gulp.task('images',function(){
	gulp.src('./src/img/*.*') //拿到img文件下的所有图片
		.pipe(imagemin()) //进行图片压缩
		.pipe(gulp.dest('./build/img/')) //压缩完后输出到build文件中的img文件里
})





gulp.task('spriter',function(){
	gulp.src('./src/css/*.css')   
		.pipe(concat('all.css'))  //这里做了一下css的合并操作。上面提到过的
		.pipe(spriter({
            'spriteSheet': './build/img/spritesheet.png', //生成的路径，这里是精灵图生成的路径 和名称。根据自己的项目自定义
            'pathToSpriteSheetFromCSS': '../img/spritesheet.png'  //替换的路径  这里是把原来引入的背景图路径替换成这个
        }))
		.pipe(cleanCss()) //这里进行了压缩操作
		.pipe(gulp.dest('./build/css/')) //最后输出到了build下面的css文件夹里
});



//浏览器兼容前缀
gulp.task("testAutoFx",function(){
	gulp.src('./styles/*.css')
	.pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        }))
    .pipe(gulp.dest('./build/styles'));
})
//gulp.task('default',['testless', 'scripts','testAutoFx'])

gulp.task('watch',function(){
    gulp.watch('./src/less/*.less',['less']);
})