import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import {  Icon, Container, Label , Button , Card } from 'semantic-ui-react';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://talentmvp.azurewebsites.net/listing/listing/closeJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType:'json',
            type: "post",
            data: JSON.stringify(id),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
                
            }.bind(this)
        })
    }

    render() {
        let i=0;
        return(
            <div className ="ui container">       
                            <Container>
                            {this.props.loadJobs.length == 0 ? ( <p>No jobs Found </p>) : ( 
                            <Card.Group itemsPerRow={2}>    
                            {this.props.loadJobs.map((job) =>
                            <Card key={job.id}>
                                <Card.Content>
                                    <Card.Header>{job.title}</Card.Header>
                                    <Label as='a' color='black' ribbon='right'>
                                    <Icon name='user'/>
                                    {i++}
                                    </Label>
                                    <Card.Meta>{job.location.city} {job.location.country}</Card.Meta>
                                    <Card.Description>
                                    {job.summary}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <Button color='red'>Expired</Button>
                                    <Button.Group floated='right'>
                                        <Button basic color='blue' id={job.id} onClick={ () => this.selectJob(job.id)}>
                                        Close
                                        </Button>
                                        <Button basic color='blue' id={job.id} href={`/EditJob/${job.id}`}>
                                        Edit
                                        </Button>
                                        <Button basic color='blue'>
                                        Open
                                        </Button>
                                    </Button.Group>
                                </Card.Content>
                                </Card>             
                            )}
                            </Card.Group>
                        )}
                            </Container>     
                            <br/>
            </div>
        )
    }
}