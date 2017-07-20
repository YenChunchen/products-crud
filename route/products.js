var express = require('express');
var router = express.Router();
var Products=require('../controller/products/products.js');
var upload  = require('../controller/products/products_form_data_upload_multer');
var products=new Products();
router.get('/all' , products.show_products);  //取得單頁商品
router.get('/update/item_id' , products.show_oneproduct);   //取得單筆商品
router.post('/create',upload.single('itempic') , products.create_item);  //建立商品
router.put('/update',upload.single('itempic') , products.update_item);  //更新商品
router.delete('/delete', products.delete_item);  //刪除一項(多項)商品


module.exports = router;
