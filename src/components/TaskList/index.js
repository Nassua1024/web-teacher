
import React, { Component } from 'react';
import { wxPreviewImage } from '@/utils/wxConfig';
import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

class TaskList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			taskList: new Array(),
			videoSrc: '',
			audioSrc: '',
			audioPlayClass: '',
			audioBgClass: '',
			audioIndex: -1,
			playIndex: -1
		};
	}

	componentWillMount() {
		this.taskList(this.props.lessonId);
	}

	/*作业列表*/
	taskList(lessonId) {

		Http.ajax(`${URL.homework_schedules}/${lessonId}/student-share`, {}).then(res => {
			if(res && res.code == 0) {

				const taskList = new Array()
					, listItem = new Object()
					, dataItem = new Object()
					, audioItem = new Object()
					, videoItem = new Object();

				res.data.homeworkTypes.map(item => {
					
					listItem.contentList = new Array();
					listItem.typeName = item.typeName;
					
					item.homeworkResponses.map(item => {
						
						dataItem.audio = new Array();
						dataItem.video = new Array();
						dataItem.img = new Array();
						dataItem.content = item.homewokContent;
						
						item.homeworkMedias.map(item => {
							switch(item.mediaType) {
								case "AUDIO":

									const time = parseInt(new Date(item.duration).Format('s'));
									if(time > 0 && time <= 12) audioItem.class = 'audio audio1';
									if(time > 12 && time <= 24) audioItem.class = 'audio audio2';
									if(time > 24 && time <= 36) audioItem.class = 'audio audio3';
									if(time > 36 && time <= 48) audioItem.class = 'audio audio4';
									if(time > 48 && time <= 60) audioItem.class = 'audio audio5';	

									audioItem.time = new Date(item.duration).Format('m.ss');
									audioItem.src = item.url;
									dataItem.audio.push(Object.assign({}, audioItem)); 
									break;
								
								case "VIDEO":
									videoItem.time = new Date(item.duration).Format('m.ss');
									videoItem.src = item.url;
									dataItem.video.push(Object.assign({}, videoItem));
									break;
								
								case "IMAGE": 
									dataItem.img.push(item.url);
									break;
							}
						});

						listItem.contentList.push(Object.assign({}, dataItem));
					});
					
					taskList.push(Object.assign({}, listItem));
				});

				this.setState({ taskList });
			}
		});
	}

	/*播放音频 视频*/
	play(src, playSrc, classId, index, i) {
		console.log(index);
		this.setState({
			[playSrc]: src,
			audioPlayClass: 'active',
			audioBgClass: 'audio-active',
			audioIndex: index,
			playIndex: i
		},() => this.listen(classId) ); 
	}

	/*预览图片*/
	previewImage(current, urls) {
		const option = { current, urls };
		wxPreviewImage(option);
	}

	hide() {
		this.setState({ videoSrc: '' });
	}

	/*监听音频、视频*/
	listen(classId) {
		document.getElementById(classId).play();
		document.getElementById(classId).addEventListener('ended', () => {
			this.setState({ audioPlayClass: '', audioBgClass: '', audioIndex: -1, playIndex: -1 });
		}, false);
	}

	render() {

		const { videoSrc, audioSrc, audioPlayClass, audioBgClass, taskList, audioIndex, playIndex } = this.state;

		return (
			<div className="taskls-container">
				{
					taskList.map((item, index) => (
						<div className="task-del" key={index}>
							<div className="type-name"><i /><h3>{item.typeName}</h3></div>
							{
								item.contentList.map((item, index) => (
									<div key={index} className="course-wrap">
										<p>{index+1}. {item.content}</p>
										{
											item.audio.length > 0 &&
											<div>
												{
													item.audio.map((item, i) => (
														<ul className={item.class} key={i}>
															<li onClick={() => this.play(item.src, 'audioSrc', 'audio', index, i)}>
																{ (audioIndex == index && playIndex == i) && <div className="audio-active" /> }
																{item.time}"<i className={(audioIndex == index && playIndex == i) ? audioPlayClass : ''} />
															</li>
														</ul>
													))
												}
											</div>
										}
										{
											item.video.length > 0 &&
											<ul>
												{
													item.video.map((item, index) => (
														<li className="video" key={index} onClick={() => this.play(item.src, 'videoSrc', 'video')}></li>
													))
												}
											</ul>
										}
										{
											item.img.length > 0 &&
											<div>
												{
													item.img.map((src, index) => (
														<img className="img" onClick={() => this.previewImage(src, item.img)} key={index} src={src} alt="" />
													))
												}
											</div>
										}
									</div>
								))
							}
						</div>
					))
				}

				{
					audioSrc != '' &&
					<audio id="audio" src={audioSrc} />
				}
				
				{
					videoSrc != '' &&
					<div className="video-wrap" onClick={() => this.hide() }>
						<video 
							id="video" 
							src={videoSrc} 
							preload="auto" 
						/>
					</div>
				}
			</div>
		)
	}
}

export default TaskList;