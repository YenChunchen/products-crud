var connectdb=require('../connectdb');
var base64str=require('./base64_encode_item');
var fs = require("fs");
var moment=require('moment');
module.exports=function (temp){
  var today=moment(Date.now()).format('YYYY/MM/DD HH:mm:ss');
  return new Promise(function(resolve,reject){
    // console.log(temp);
    // console.log(today);
    var selstr="SELECT * FROM products where name="+"'"+temp.name+"'";
    connectdb.query(selstr, function(err, rows) {  //create newaccount
      if(err){
          reject(err);
          return;
      }
      if(rows.length!==0){   //判斷帳號是否重複
        if(temp.file!==''){
          fs.unlink('pic/products/'+temp.file.filename);  //如帳號存在不存圖
        }
        var isexist='該商品已存在,請確認';
        resolve(isexist);
      }else{
        var new_products={};
        new_products.name=temp.name;
        new_products.price=temp.price;
        new_products.store=temp.store;
        if(temp.file!==''){
          new_products.old_pic_name=temp.file.originalname;
          new_products.photo=base64str.base64_encode(temp.file.filename);
          new_products.new_pic_name=temp.file.filename;
        }else{
          new_products.old_pic_name='';
          new_products.photo='';
          new_products.new_pic_name='';
        }
        new_products.describe=temp.describe;
        new_products.create_time=today;
        connectdb.query("INSERT INTO products SET ?",new_products);  //沒重複建立
        var success='商品創建成功';
        resolve(success);
      }
    });
  });
};
