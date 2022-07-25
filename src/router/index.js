// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '@/views/Index.vue'
import Add from "@/views/AddGoods.vue"
import Login from "@/views/Login.vue"
import Swiper from "@/views/Swiper.vue"
import DialogAddSwiper from "@/components/DialogAddSwiper.vue"
// import Test from "@/components/Test.vue"
import IndexConfig from "@/views/IndexConfig.vue"
import Category from "@/views/Category.vue"
import Good from '@/views/Good.vue'
import Order from '@/views/Order.vue'
import OrderDetail from '@/views/OrderDetail.vue'
import Guest from '@/views/Guest.vue'
import Account from '@/views/Account.vue'

const router = createRouter({
    history: createWebHashHistory(), // hash 模式
    routes: [
        {
            // name属性是为了配置在进行路由跳转时获取to.name直接对header的title进行修改
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/add',
            name: 'add',
            component: Add
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/swiper',
            name: 'swiper',
            component: Swiper,

        },
        {
            path: '/dialogadd',
            name: 'dialogadd',
            component: DialogAddSwiper
        },
        // {
        //     path: '/test',
        //     name: 'test',
        //     component: Test
        // }, 
        {
            path: '/hot',
            name: 'hot',
            component: IndexConfig
        }, {
            path: '/new',
            name: 'new',
            component: IndexConfig
        }, {
            path: '/recommend',
            name: 'recommend',
            component: IndexConfig
        }, {
            path: '/category',
            name: 'category',
            component: Category,
            children: [
                {
                    path: 'level2',
                    name: 'level2',
                    component: Category
                }, {
                    path: '/category/level3',
                    name: 'level3',
                    component: Category
                }
            ]
        }, {
            path: '/good',
            name: 'good',
            component: Good
        }, {
            path: '/order',
            name: 'order',
            component: Order
        }, {
            path: '/order_detail',
            name: 'order_detail',
            component: OrderDetail
        }, {
            path: '/guest',
            name: 'guest',
            component: Guest
        }, {
            path: '/account',
            name: 'account',
            component: Account
        },


    ]
})




export default router