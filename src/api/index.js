const { NODE_ENV } = process.env;
let baseURI = '';
const context = '/v_1_0/wechat';

// baseURI = 'http://teacher.shbaoyuantech.com'; pro
if (NODE_ENV == 'development') {
	baseURI = 'http://qywx.test.shbaoyuantech.com/teacher';
} else {
	baseURI = 'http://teacher.shbaoyuantech.com';
}

const URL = {
	// 获取token
	wechat_auth_link: '/get-wechat-auth-link',

	// 获取课程列表
	lesson_schedules: `${context}/lesson-schedules`,

	// 批改作业列表 学员列表 学员作业列表
	homework_schedules: `${context}/homeworks`,
	
	// 批量批改
	batch_correction: `${context}/homeworks/remarks`,

	//获取签到列表
	signed_lessons:`${context}/lesson-schedules/signed-lessons`,

	//获取签到详情/lesson-schedules/{lessonScheduleId}/sign-detail
	sign_detail:`${context}/lesson-schedules`,

	// 删除补课学员
	deletet_detail:`${context}/lesson-schedules/makeup-student`,
	
	// 查询可补课学员列表
	makeup:`${context}/lesson-schedules/students/makeup`,

	// 签到操作
	sign:`${context}/lesson-schedules/`,

	// 保存课堂内容
	save_content: `${context}/lesson-schedules/save-content`,

	// 分馆
	stores: `${context}/stores`,

	// 教室
	classrooms: `${context}/stores/classrooms`,

	// 教师
	teachers: `${context}/stores/teachers`,

	// 排课规则
	class_schedule: `${context}/classes/class-schedule`,
	
	// 获取插班学员
	seainter_stu: `${context}/lesson-schedules/students`,

	// 获取学员合同列表
	stu_contracts: `${context}/contracts`,

	// 获取分馆列表
	stores: `${context}/stores`,

	// 获取分馆教室
	store_cr: `${context}/stores/classrooms`,

	// 获取分馆课程列表
	store_courses: `${context}/stores/courses`,

	// 获取分馆课程列表
	class_time: `${context}/classes/rules`,

	// 补课中 查询学生
	makeup_stu: `${context}/students`,

	// 增加补课
	add_makeup: `${context}/classes/add-makeup`,	
};

export { URL, context };
export default baseURI;
