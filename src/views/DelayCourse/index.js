
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Picker, List, Button, Toast, Modal } from 'antd-mobile';
import { URL } from '@/api';
import Http from '@/utils/base';

class DelayCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lessonScheduleId: null,
            courseTitle: '',
            oldTime: '',
            startTime: '',
            endTime: '',
            pickerData: [
                {
                    data: [[]],
                    title: '选择延期日期',
                    id: null,
                    disabled: false
                }, {
                    data: [[]],
                    title: '选择时间段',
                    id: null,
                    disabled: true
                }, 
            ],
            baseDate: [],
            baseTime: []
        };
    }

    componentWillMount() {

        document.title = '课程延期';
        const lessonDate = localStorage.getItem('lessonDate') ? JSON.parse(localStorage.getItem('lessonDate')) : '';
        const { courseTitle, oldTime, startTime, endTime } = lessonDate;
        const lessonScheduleId = this.props.match.params.id;

        this.setState({ courseTitle, oldTime, startTime, endTime, lessonScheduleId }, () => this.initBaseDate())
    }

    // 初始化延期开始时间
    initBaseDate() {

        const { lessonScheduleId } = this.state;
        const params = { data: { lessonScheduleId } };

        Http.ajax(URL.class_schedule, params).then(res => {
            if(res && res.code == 0) {

                let { baseDate, baseTime } = this.state;
                const { oldTime } = this.state;
                const oneTime = 24 * 60 * 60 * 1000;

                res.data.classSchedules.map((item, index) => {
                    for(let i=oldTime; ; i+=oneTime) {
                        if(new Date(i).getDay() == item.week) {
                            
                            let timeArr = [];
                            baseDate.push(i+oneTime);
                            
                            item.times.map(time => {
                                let timeObj = {};
                                timeObj.label = time.startTime + '-' + time.endTime;
                                timeObj.value = timeObj.label;
                                timeArr.push(timeObj);
                            });
                            
                            baseTime.push(timeArr);
                            return false;
                        }
                    }
                })

                this.setState({ baseDate, baseTime }, () => this.calcDate() );
            }
        }) 
    }

    // 计算延期时间段
    calcDate() {

        let { pickerData } = this.state;
        const { baseDate, oldTime } = this.state;
        const sevenTime = 24 * 60 * 60 * 1000 * 7;
        const nowMonth = new Date(oldTime).getMonth();

        baseDate.map((item, index) => {
            for(let i=item; ; i+=sevenTime) {
                
                let dataItem = {};
                let weekDay = '';

                if(new Date(i).getMonth() - nowMonth > 1)
                    return false;

                switch(new Date(i).getDay()) {
                    case 0:
                        weekDay = '周日'
                        break;
                    case 1:
                        weekDay = '周一'
                        break;
                    case 2:
                        weekDay = '周二'
                        break;
                    case 3:
                        weekDay = '周三'
                        break;
                    case 4:
                        weekDay = '周四'
                        break;
                    case 5:
                        weekDay = '周五'
                        break;
                    case 6:
                        weekDay = '周六'
                        break;
                }

                dataItem.label = new Date(i).Format('yyyy-MM-dd') + ' ' + weekDay;
                dataItem.value = new Date(i).Format('yyyy-MM-dd');  
                dataItem.index = index;

                pickerData[0].data[0].push(dataItem);
            }
        })

        pickerData[0].data[0] = pickerData[0].data[0].sort((a, b) => {
            if(a.value > b.value)
                return 1;
            else if (a.value == b.value)
                return 0;
            else 
                return -1;
        })

        this.setState({ pickerData });
    }

    // 选择日期、时间
    handleChange(i, v, data) {

        const { pickerData, baseTime } = this.state;

        i == 0 &&
        data.some(item => {
            if(item.value == v) {
                pickerData[1].data[0] = baseTime[item.index];
                pickerData[1].id = null;
                pickerData[1].disabled = false;
            }
        })

        pickerData[i].id = v;
        this.setState({ pickerData });
    }


    handleClick(index) {

        const { pickerData } = this.state;

        if(pickerData[0].id == null && index == 1) 
            Toast.info('请先选择延期日期', 1);
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

        Modal.alert('', `确认是否要延期课程~`, [
            { text: '取消' },
            { text: '确定', onPress: () => this.ensureDelay() },
        ]);
    }

    // 确认延期
    ensureDelay() {
      
        const { pickerData, lessonScheduleId } = this.state;
        const params = {
            method: 'POST',
            formData: false,
            data: {
                newStartTime: pickerData[0].id[0] + ' ' + pickerData[1].id[0].slice(0, 5),
                newEndTime: pickerData[0].id[0] + ' ' + pickerData[1].id[0].slice(-5)
            }
        };

        Http.ajax(`${URL.lesson_schedules}/${lessonScheduleId}/defer`, params).then(res => {
            if(res && res.code == 0)
                this.props.history.push(`/searchcourse?date=${pickerData[0].id[0]}`);
        });
    }

    render() {

        const { courseTitle, pickerData, oldTime, startTime, endTime } = this.state;

        return (
            <div className="delay-course adjust-class">
                <h3>{ courseTitle }</h3>
                <div className="old-time">
                    <label>原上课时间</label>
                    <p>{ new Date(oldTime).Format('yyyy-MM-dd') }</p>
                    <p>{ `${startTime}-${endTime}` }</p>
                </div>
                <div className="select-wrap old-time">
                    <label>延期至</label>
                    {
                        pickerData.map((item, index) => (
                            <Picker
                                key={ index }
                                data={ item.data }
                                title={ item.title }
                                cascade={ false }
                                extra={ '请' + item.title }
                                value={ item.id }
                                disabled={ item.disabled }
                                onChange={ v => this.handleChange(index, v, item.data[0]) }
                            >
                                    <List.Item arrow="horizontal" onClick={ () => this.handleClick(index) } />
                            </Picker>
                        ))
                    }
                </div>
                <p className="tip">点选确定，所有课程根据您选择的时间依次顺延。</p>
                <div className="btn">
                    <Link to="/searchcourse"></Link>
                    <Button onClick={ () => this.commit() }></Button>
                </div>
            </div>
        )
    }
};

export default DelayCourse;