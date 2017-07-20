var connectdb=require('../connectdb');
var fs = require('fs');
var async=require('async');
var failarr=[],successarr=[];
exports.delete_products=function (id,current,max){  //刪除會員資料
//id該次產品id,current目前迴圈數,max最大執行迴圈數,failarr存放錯誤訊息,successarr存放成功訊息
  current++;
  var delstr="DELETE  FROM products WHERE id="+id;
  var selstr="SELECT * FROM products WHERE id="+id;
  return new Promise(function(resolve,reject){
    async.waterfall([
      finditem,
      delitem,
    ],
    function(err){  //判斷是否為最後一次迴圈
      if(current===max){
         var list={
           success:successarr,
           fail:failarr
         };
         failarr=[];  //每次刪除完暫存陣列歸空
         successarr=[];
         resolve(list);
      }
    });
    //判斷該產品id是否存在,存在則先刪其圖檔
    function finditem(callback){
      connectdb.query(selstr,function(err,rows){
        if(rows===undefined){
          reject(err);
          return;
        }
        if(rows.length===0) {
          failarr.push(id+'商品不存在');
          if(current===max){
              callback(null);
              return;
          }
          else{
              return;
          }
        }
        else{
          if(rows[0].new_pic_name!==''){
            fs.unlink('pic/products/'+rows[0].new_pic_name);
          }
          callback(null);
        }
      });
    }
    //再刪除該產品資料
    function delitem(callback){
      connectdb.query(delstr,function(err,rows){
        if (err) {
          reject(err);
          return;
        }
        else{
          if(rows.affectedRows!==0){
            successarr.push(id+'商品刪除成功');
            callback(null);
          }
          else callback(null);
        }
      });
    }
  });
};
