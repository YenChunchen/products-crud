var express = require('express');
var router = express.Router();
var create_product_todb=require('../../model/products/create_product_todb');
var delete_product_todb=require('../../model/products/delete_product_todb');
var show_product_todb=require('../../model/products/show_product_todb');
var update_product_todb=require('../../model/products/update_product_todb');
var fs = require("fs");

module.exports= class products{
  show_products(req,res){    //顯示單頁商品資料
    var page=req.query.page;
    if(page===''||page===undefined){
      page=1;
    }
    var rangestr='';
    var current=parseInt(page);
    var x,y; //x為該頁第一筆,y為該頁最末筆
    if(page===undefined){
      x=0;
      y=20;
    }else{
      if(page==='NaN'){   //如果沒有page uri querystring
          x=0;  //則顯示第一頁
          y=20;
      }else{
          x=(current-1)*20;   //page: 1  2   3
          y=(current*20);   //   x: 0  20  40
      }                     //   y: 19 39  59
    }
    rangestr=x+","+y;
    var sel_str="SELECT * FROM products limit "+rangestr;
    // console.log(sel_str);
    show_product_todb(sel_str).then(
      function(rows){
        res.json({list:rows});
      }
    ).catch(function(err){
      res.status(500).json({message:catch_db_error(err)});
    });
  }
  show_oneproduct(req,res){    //顯示單筆商品資料
    var id =req.query.id;
    if(id===''||id===undefined||isNaN(id)){
      res.status(400).json({message:'欄位錯誤'});
    }
    update_product_todb.get_oneitem(id).then(
      function(rows){
          res.json({list:rows});
      }).catch(function(err){
        res.status(500).json({message:catch_db_error(err)});
      });
  }
  create_item(req,res){   //建立商品資料
    var temp=req.body;
    var file=req.file;
    var result=check_field(temp,file);
    if(typeof result==='string'){
      res.status(400).json({message:result});
    }else{
      create_product_todb(result).then(function(result){
        res.json({message:result});
      }).catch(function(err){
        res.status(500).json({message:catch_db_error(err)});
      });
    }
  }
  update_item(req,res){   //更新商品資料
    var temp=req.body;
    var file=req.file;
    var id=req.params.item_id;
    var result=check_field(temp,file);
    // console.log(result);
    if(typeof result==='string'){
      res.status(400).json({message:result});
    }else{
      result.product_id=id;
      update_product_todb.edit_item(result).then(
        function(success){
          res.json({message:success});
        }
      ).catch(function(err){
        res.status(500).json({message:catch_db_error(err)});
      });
    }
  }
  delete_item(req,res){   //刪除多筆商品資料
    var delitems =req.body.id;
    if(delitems===''||delitems===undefined){
      res.status(400).json({message:'請輸入正確欄位'});
    }
    var delarr=delitems.split(',');
    var current=0,check=0,max=delarr.length;
    var failarr=[],successarr=[];
    for(var i in delarr)
    {
      var id=delarr[i];
      delete_product_todb.delete_products(id,i,max).then(function(result){
        res.json(result);
      }).catch(function(err){
        res.status(500).json({message:catch_db_error(err)});
      });
    }
  }
};

function check_field(temp,file){
  if((temp.name==='')||(temp.name===undefined)) {
    if(file!==undefined){
      fs.unlink('pic/products/'+file.filename);
    }
    return '請輸入商品名稱';
  }
  if((temp.price==='')||(temp.price===undefined))  {
    if(file!==undefined){
      fs.unlink('pic/products/'+file.filename);
    }    return '請輸入商品價格';
  }
  if((temp.store==='')||(temp.store===undefined))  {
    if(file!==undefined){
      fs.unlink('pic/products/'+file.filename);
    }    return '請輸入商品存量';
   }
   if(temp.describe===undefined){
     temp.describe='';
   }
   var result={
     name:temp.name,
     price:temp.price,
     store:temp.store,
     file:(file===undefined)?'':file,
     describe:temp.describe
   };
   return result;
}


function catch_db_error(err){
  if(err.code==='PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR'){
    err='請稍後再試';
  }else{
    err=err;
  }
  return err;
}
