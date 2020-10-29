# gulpStarter

### Installation
Proyekti clone edtdikden sonra terminalı proyekt içinde açıb sırası ile aşağıdakı komandaları yazmaq lazımdır (node, bower ve gulp pc de yüklü deyilse ilk olaraq bu üçü yüklenmelidir)
```shell
npm install
```
```shell
bower install
```
```shell
gulp
```

### Development terefinde istifade olunanlar
#### GULP
#### SASS
#### NPM
#### BOWER
#### BEM
#### SMACSS 

## GULP
Development terefinde bütün deyişiklikler **/src** klasörü içerisinde olunur gulp ile compile edilerek **/build** klasörüne atılır.
Back-end developera  sadece **/build** klasörü içerisindekiler lazımdır

Gulp'da görülen işler <br />
-SASS kompile edilir<br />
-autoprefixer ile  prefixler elave olunur <br />
-fileinclude ile header ile footer kimi bütün seyfede olan layoutları import edirik<br />
-minify ile js dosyasını minify edirik<br />
-cleanCSS ile css dosyalarını minify edirik<br />
-rename ile minify edilen css dosyasının sonuna .min elave ederek adın deyişirik<br />
-concat ile js/main klasörü içinde yazdığımız ferqli .js dosyalarını birleşdirib main.js dosyasına atırıq<br />
<br />
## SASS
Sass dosyaları **/src** klasörü altındaki **/css** klasörü içerisindedi bütün css deyişiklikleri burda olunacaq daha rahat başa düşülmesi üçün **SMACSS** standartı ile klasörler yaradılıb hansı klasörde ne olduğu aşağıdadı <br />

### /abstracts
mixinler ve variable lar tutulur

### /base

bu klasörde temel bezi css dosyaları olur fontlar ucun css bu klasörde olur

### /components
Bu klasörde saytın birçox yerinde istifade olan elementler olur modal kimi pagination kimi komponentler yazıb her yerde rahatlıqla işledirik

### /layout
Burda footer header navigation kimi layoutları tuturuq

### /pages
Bu klasörde de her seyfeye aid bir css dosyası oluşdururuq her seyfeye aid css deyişikliklerini burda eleyirk 


## NPM
package.json dosyasında  development üçün hansı  paketlerin qurulduğu var

## BOWER
Saytta istifade olunan bütün freamwork ve pluginler bower ile qurulub neler yüklendiyini  bower.json  dosyasına baxaraq göre bilersiz.
Bower ile yüklenen paketler /lib klasörüne düşür biz sayt içinde bu /lib klasöründen çağırırıq

## BEM
bütün css class adları BEM standardına uyğun olaraq verilib


## LIVERELOAD
startere livereload elave edilib ctrl + s etdiyiniz anda avtomatik olaraq starter ozu deyisikliy olunan fayllari yenilecey ve butun dosyalariniz yenilenecey  bununlada sizin 
bowserde refresh etmeyinze ehtiyac qalmayacaq

## LIVERELOAD DISABLED
bezen livereload butun doslayari yenilediyi ucun gec isleye biler isteseniz livereloadi deaktiv ede bilersiniz bunun ucun gulpfile js icinde function livreloadi disabled elemey lazimdir 







