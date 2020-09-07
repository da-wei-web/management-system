import { request } from './request'

// 添加商品
export function addGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data,
  })
}

// 删除商品
export function deleteGoodsById(id) {
  return request({
    url: '/goods/' + id,
    method: 'delete',
  })
}

// 获取商品列表
export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: '/goods',
    params: {
      query,
      pagenum, 
      pagesize,
    },
  })
}

// 根据id获取商品信息
export function getGoodsById(id) {
  console.log(id)
  return request({
    url: '/goods/' + id,
  })
}

// 编辑商品信息提交
export function editGoods(id, data) {
  return request({
    url: '/goods/' + id,
    method: 'put',
    data,
  })
}
export class GoodsMsg {
  constructor(data) {
    this.goods_cat = data.goods_cat;
    this.goods_name = data.goods_name;
    this.goods_price = data.goods_price;
    this.goods_number = data.goods_number;
    this.goods_weight = data.goods_weight;
    this.goods_introduce = data.goods_introduce;
    this.pics = data.pics;
    this.attrs = data.attrs;
  }
}
