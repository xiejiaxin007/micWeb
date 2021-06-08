/**
 * describe: 修改config路径、修改导出方式
 * updater: xiejiaxin
 * updateTime: 2019.12.11
 */

// 托管状态数据
 const collocationStatus = [
    {
      value: 1, text: '托管中'
    },
    {
      value: 2, text: '未托管'
    },
    {
      value: 3, text: '离线中'
    }
];

// 控制新增配置权限 权限：admin-sop总管理员(SOP)  super_admin超级管理员
const collocationConfAccess = ['admin-sop', 'super_admin'];

export {
	collocationStatus,
	collocationConfAccess
};
