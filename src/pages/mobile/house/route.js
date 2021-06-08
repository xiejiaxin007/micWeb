
const AppAnswerQuestion = () => import('./AppAnswerQuestion')
const AppAnswerDetail = () => import('./AppAnswerDetail')
const houseIndex = () => import('./houseIndex')
export default {
    path: '/',
    name: 'houseIndex',
    component: houseIndex,
    children: [
        {
            path: '/appAnswerQuestion',
            name: 'AppAnswerQuestion',
            component: AppAnswerQuestion,
            meta: {
                tit: '问题回答页'
            }
        },
        {
            path: '/appAnswerDetail',
            name: 'AppAnswerDetail',
            component: AppAnswerDetail,
            meta: {
                tit: '问题详情页'
            }
        }
    ]
  }