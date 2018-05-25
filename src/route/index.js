import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import Layout from '@/views/Layout';
import Index from '@/views/Index';
import SearchCourse from '@/views/SearchCourse';
import CourseManage from '@/views/CourseManage';
import CourseSignIn from '@/views/CourseSignIn';
import HadSingInCourse from '@/views/HadSingInCourse';
import EditSignInCourse from '@/views/EditSignInCourse';
import StudentAddress from '@/views/StudentAddress';
import TaskCourse from '@/views/TaskCourse';
import ModifyTask from '@/views/ModifyTask';
import TaskModifing from '@/views/TaskModifing';
import TaskDetail from '@/views/TaskDetail';
import SharePage from '@/views/SharePage';
import CorrectAll from '@/views/CorrectAll';
import AdjustClass from '@/views/AdjustClass';
import DelayCourse from '@/views/DelayCourse';
import SearchStudent from '@/views/SearchStudent';
import ContractsList from '@/views/ContractsList';
import AddMakeUp from '@/views/AddMakeUp';

export const childRoutes = [
	{
		path: '/index',
		component: Index,
		exact: true
	},
	{
		path: '/searchcourse',
		component: SearchCourse
	},
	{
		path: '/coursemanage/:courseid',
		component: CourseManage
	},
	{
		path: '/coursesignin/:id',
		component: CourseSignIn
	},
	{
		path: '/dscourse/:id',
		component: HadSingInCourse
	},
	{
		path: '/edcourse/:id',
		component: EditSignInCourse
	},
	{
		path: '/searchstu/:id/:type',
		component: SearchStudent
	},
	{
		path: '/staddress/:id',
		component: StudentAddress
	},
	{
		path: '/taskcourse',
		component: TaskCourse
	},
	{
		path: '/mdtask/:id/:type',
		component: ModifyTask
	},
	{
		path: '/taskmd/:id',
		component: TaskModifing
	},
	{
		path: '/tashdetail/:id',
		component: TaskDetail
	},
	{
		path: '/sharepage/:id',
		component: SharePage
	},
	{
		path: '/correctall/:id',
		component: CorrectAll
	},
	{
		path: '/adjustclass/:id',
		component: AdjustClass
	},
	{
		path: '/delaycourse/:id',
		component: DelayCourse
	},
	{
		path: '/contracts/:stuid/:lesId/:type',
		component: ContractsList
	},
	{
		path: '/addmk',
		component: AddMakeUp
	}
];

const routes = (
	<Switch>
  		<Route path="/" component={ Layout }/>
  	</Switch>
);

export default routes;