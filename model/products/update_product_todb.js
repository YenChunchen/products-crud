var connectdb=require('../connectdb');
var base64str=require('./base64_encode_item');
var fs = require("fs");
var date=new Date();
exports.get_oneitem=function (id) {     //顯示全部資料function
  return new Promise(function(resolve,reject){
    var select_str="SELECT * FROM products WHERE id="+id;
    connectdb.query(select_str, function(err, rows) {
      if (err) {
        reject(err);
        return;
      }
      else{
        if(rows.length!==0){
          resolve(rows);
        }else{
          reject('無該項商品');
        }
      }
    });
  });
};

exports.edit_item=function (temp) {  //更新function
  return new Promise(function(resolve,reject){
    var today=(date.getFullYear()).toString()+'/'+(date.getMonth()+1).toString()+'/'+(date.getDate()).toString();
    // console.log(temp,today);
    var sel_str='select * from products where id ='+temp.product_id.toString();
    var upd_str='update products set ? where id ='+temp.product_id.toString();
    connectdb.query(sel_str,function(err,rows){
      if(err){
        reject(err);
        return;
      }
      if(rows.length===0){
        if(temp.file!==''){
          fs.unlink('./pic/products/'+temp.file.filename);
        }
        var nonexist='無該項商品';
        resolve(nonexist);
      }
      else{
        if(rows[0].new_pic_name!==''){
          fs.unlink('./pic/products/'+rows[0].new_pic_name);  //移除前次圖檔
        }
        var item_changed={};
        item_changed.name=temp.name;
        item_changed.price=temp.price;
        item_changed.store=temp.store;
        if(temp.file!==''){
          item_changed.old_pic_name=temp.file.originalname;
          item_changed.photo=base64str.base64_encode(temp.file.filename);
          item_changed.new_pic_name=temp.file.filename;
        }else{
          item_changed.old_pic_name='';
          item_changed.photo='';
          item_changed.new_pic_name='';
        }
        item_changed.describe=temp.describe;
        item_changed.create_time=today;
        connectdb.query(upd_str,item_changed,function(err,rows){
          if(err)
              reject(err);
          else{
              var success='更新成功';
              resolve(success);
          }
        });
      }
    });
  });
};
