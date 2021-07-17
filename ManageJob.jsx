import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Container, Header,Dropdown,Icon,Checkbox,Label,List, Item } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: false,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.onPaginationClick=this.onPaginationClick.bind(this);
        this.onDropdownClick=this.onDropdownClick.bind(this);
        this.onSortDropdownClick=this.onSortDropdownClick.bind(this);
        //your functions go here
    };
    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
         console.log(this.state.loaderData)
    }
    componentDidMount() {
        this.init();
    };
    loadData(callback) {
        //var link = 'http://talentmvp.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       $.ajax({
        url: 'http://talentmvp.azurewebsites.net/listing/listing/GetSortedEmployerJobs',
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        contentType: "application/json",
        data: {
            activePage: this.state.activePage, 
            sortbyDate: this.state.sortBy.date,
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired,
            limit: 6
        },
        dataType: "json",
        success: function (res) {
            this.setState(
                {
                    loadJobs:res.myJobs,
                    totalPages:Math.ceil(res.totalCount/6)
                }
            )
            callback()
        }.bind(this),
        error: function (res) {
        console.log(res.status)
        callback()
        }
    }) 
    }
    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    onPaginationClick(e,d)
    {
        const data = Object.assign({}, this.state)
        data['activePage'] = d.activePage
        this.setState(
            {
                activePage:d.activePage
            }
        )
        this.loadNewData(data)
    }  
    onDropdownClick(event,data)
    {
        const data1 = Object.assign({}, this.state)
        var filter=this.state.filter
        let i
        if(data.label == "showActive")
        {
            data.checked == true ? filter.showActive=true  : filter.showActive=false
        }
        if(data.label == "showClosed")
        {
            data.checked == true ? filter.showClosed=true  : filter.showClosed=false
        }
        if(data.label == "showDraft")
        {
            data.checked == true ? filter.showDraft=true  : filter.showDraft=false
        }
        if(data.label == "showExpired")
        {
            data.checked == true ? filter.showExpired=true  : filter.showExpired=false
        }
        if(data.label == "showUnexpired")
        {
            data.checked == true ? filter.showUnexpired=true  : filter.showUnexpired=false
        }
        this.setState(
            {
                filter
            }
        )
       this.loadNewData(data1) 
    }
    onSortDropdownClick(event,data)
    {
        const data1 = Object.assign({}, this.state)
        var sortBy = this.state.sortBy
        if(data.text == 'Newest first')
        {
            sortBy.date = "desc"
        }
        else
        {
            sortBy.date = "aesc"
        }
        this.setState(
            {
                sortBy
            }
        )
        this.loadNewData(data1) 
    }
    render() {
        const options=[
            {key:'1' ,text:'showActive' ,value:'true'},
            {key:'2' ,text:'showClosed' ,value:'true'},
            {key:'3' ,text:'showDraft', value:'true'},
            {key:'4' ,text:'showExpired', value:'true'},
            {key:'5' ,text:'showUnexpired', value:'false'}
        ]
        const sortItem=[
            {key:'1',text:'Newest first',value:'desc'},
            {key:'2',text:'Oldest first',value:'asce'}
        ] 
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
               <div className ="ui container">
               <Header as='h2'>List of jobs</Header>
                                <label><Icon name='filter'/>Filter: </label>
                                <Dropdown text='Choose filter' onChange={this.onDropdownClick} icon='caret down' multiple >
                                    <Dropdown.Menu>
                                    {options.map((option)=>
                                    <Dropdown.Item key={option.key} text={<Checkbox key={option.key} label={option.text} value={option.value} onChange={this.onDropdownClick} defaultChecked={this.state.filter[option.text]}/>} />
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <label><Icon name='calendar alternate'/>Sorted by date: </label>
                                <Dropdown text={this.state.sortBy.date == "desc" ? sortItem[0].text : sortItem[1].text} icon='caret down'>
                                    <Dropdown.Menu>
                                    {sortItem.map((option)=>
                                    <Dropdown.Item key={option.key} text={option.text} onClick={this.onSortDropdownClick} />
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <br/>
                                <br/>        
               <JobSummaryCard filters={this.state.filter} sortedBy={this.state.sortBy} loadJobs={this.state.loadJobs}></JobSummaryCard>
               <Container textAlign='right'>
                    <Pagination
                        defaultActivePage={this.state.activePage}
                        totalPages={this.state.totalPages}
                        onPageChange={this.onPaginationClick}
                    />
                </Container>
                <br/>
                </div>
            </BodyWrapper>
        )
    }
}