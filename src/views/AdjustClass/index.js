
import React, { Component } from 'react';
import{ Link } from 'react-router-dom';
import { Picker, List, Button, Toast, DatePicker, Modal } from 'antd-mobile';
import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

class AdjustClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseTitle: '',
            pickerData: [
                { 
                    mode: 'date',
                    title: '选择日期',
                    id: null
                }, {
                    data: [[]],
                    title: '选择时间',
                    id: null
                }, {
                    data: [[]],
                    title: '选择分馆',
                    id: null
                }, {
                    data: [[]],
                    title: '选择教室',
                    id: null,
                    disabled: true
                }, {
                    data: [[]],
                    title: '选择老师',
                    id: null,
                    disabled: true
                }
            ]
        }
    }  

    componentWillMount() {

        const courseTitle = localStorage.getItem('lessonDate') ? localStorage.getItem('lessonDate') : '';

        this.setState({ courseTitle });
        this.initStore();
        this.initTime();
    }

    // 初始化分馆
    initStore() {
        Http.ajax(URL.stores, {}).then(res => {
            if(res && res.code == 0) {
                
                let { pickerData } = this.state;
                
                res.data.stores.map((item) => {
                    let dataItem = {};
                    dataItem.value = item.id;
                    dataItem.label = item.name+'-'+item.companyName;
                    pickerData[2].data[0].push(dataItem);

                });

                this.setState({ pickerData });
            }
        });
    }

    // 初始化教室 v => 分馆Id
    initClazz(v) {

        const params = { data: { storeId: v } };

        Http.ajax(URL.classrooms, params).then(res => {
            if(res && res.code == 0) {

                let { pickerData } = this.state;
                pickerData[3].data[0] = [];

                res.data.classroomDatas.map(item => {
                    let dataItem = {};
                    dataItem.value = item.id;
                    dataItem.label = item.name;
                    pickerData[3].data[0].push(dataItem);
                });

                this.setState({ pickerData });
            }
        });
    }

    // 初始化教室 v => 分馆Id
    initTeacher(v) {

        const params = { data: { storeId: v } };

        Http.ajax(URL.teachers, params).then(res => {
            if(res && res.code == 0) {

                let { pickerData } = this.state;
                pickerData[4].data[0] = [];

                res.data.teachers.map(item => {
                    let dataItem = {};
                    dataItem.value = item.id;
                    dataItem.label = item.name;
                    pickerData[4].data[0].push(dataItem);
                })

                this.setState({ pickerData });
            }
        })
    }

    // 初始化时间段
    initTime() {
        Http.ajax(URL.class_time, {}).then(res => {
            if(res && res.code == 0) {

                const { pickerData } = this.state;
                const rules = res.data.rules;

                pickerData[1].data[0] = rules.map(item => {
                    const { startTime, endTime } = item;
                    // const start = new Date(startTime).Format('hh:mm');   
                    // const end = new Date(endTime).Format('hh:mm');
                    return { label: `${startTime}-${endTime}`, value: `${startTime}-${endTime}` };
                })

                this.setState({ pickerData });
            }
        });
    }

    // 选择日期、时间、教室、老师、分馆
    // index => 选择的类型  v => 选择的数据
    handleChange(index, v) {
        
        let { pickerData } = this.state;

        if(index == 0) {
            pickerData[index].id = v
        } else {
            if(index == 2) {
               
                pickerData[3].disabled = false;
                pickerData[4].disabled = false;
                
                if(v[0] != pickerData[2].id) {
                    this.initClazz(v[0]);
                    this.initTeacher(v[0]);
                }

                if(pickerData[2].id != null && v[0] != pickerData[2].id) {
                    pickerData[3].id = null;
                    pickerData[4].id = null;
                }
            }
            pickerData[index].id = v;
        }

        this.setState({ pickerData });
    }

    // 选择 教室、老师 前判断是否选择分馆 
    // index => 选择的类型
    handleClick(index) {
        
        const { pickerData } = this.state;

        if(pickerData[2].id == null && index > 2) 
            Toast.info('请先选择分馆', 1);
    }

    // 确认
    commit() {

        const { pickerData } = this.state;
        
        for(let i=0; i<pickerData.length; i++) {
            if(pickerData[i].id == null) {
                Toast.info(`请${pickerData[i].title}`, 1);
                return false;
            }
        }

        Modal.alert('', `确认是否要调整课程~`, [
            { text: '取消' },
            { text: '确定', onPress: () => this.ensureAdjust() },
        ]);
    }

    // 确认调整
    ensureAdjust() {
        
        const { pickerData } = this.state;
        const lessonScheduleId = this.props.match.params.id;
        const newStartTime = new Date(pickerData[0].id).Format('yyyy-MM-dd') + ' ' + pickerData[1].id[0].slice(0, 5);
        const newEndTime = new Date(pickerData[0].id).Format('yyyy-MM-dd') + ' ' + pickerData[1].id[0].slice(-5);
        const newStoreId = pickerData[2].id[0];
        const newClassroomId = pickerData[3].id[0];
        const newTeacherId = pickerData[4].id[0];
        const newDate = new Date(pickerData[0].id).Format('yyyy-MM-dd');

        const params = {
            method: 'POST',
            formData: false,
            data: {
                newStartTime,
                newEndTime,
                newStoreId,
                newTeacherId,
                newClassroomId
            }
        };

        Http.ajax(`${URL.lesson_schedules}/${lessonScheduleId}/batch-adjust`, params).then(res => {
            if(res && res.code == 0) 
                this.props.history.push(`/searchcourse?date=${newDate}`);
        });
    }

    render() {

        const { pickerData, courseTitle } = this.state;

        return (
            <div className="adjust-class">
                <h3>{ courseTitle }</h3>
                <div className="select-wrap">
                    {
                        pickerData.map((item, index) => (
                            index < 1 ?
                            <DatePicker
                                key={ index }
                                mode={ item.mode }
                                title={ item.title }
                                minDate={ index == 0 ? new Date() : '' }
                                extra={ item.id == null ? `请${item.title}` : item.id }
                                value={ index == 0 ? item.id : '' }
                                onChange={ v => this.handleChange(index, v) }
                            >
                                <List.Item arrow="horizontal" />
                            </DatePicker>:
                            <Picker
                                key={ index }
                                data={ item.data }
                                title={ item.title }
                                cascade={ false }
                                extra={ '请' + item.title }
                                value={ item.id }
                                disabled={ item.disabled }
                                onChange={ v => this.handleChange(index, v) }
                            >
                                    <List.Item arrow="horizontal" onClick={ () => this.handleClick(index) } />
                            </Picker>
                        ))
                    }
                </div>
                <p className="tip">单次调课只影响本次课堂，如需永久调整课堂，请联系馆长操作</p>
                <div className="btn">
                    <Link to="/searchcourse"></Link>
                    <Button onClick={ () => this.commit() }></Button>
                </div>
            </div>
        ) 
    }
};

export default AdjustClass;