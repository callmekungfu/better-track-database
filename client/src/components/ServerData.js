import React, { Component } from 'react';

class ServerData extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/hello')
        .then(results => results.json())
        .then((data) => {
            const meets = data.map(info => (
                    <tr key={info.name}>
                        <td>{info.name}</td>
                        <td>{info.date}</td>
                        <td>{info.location}</td>
                    </tr>
                ));
            this.setState({ data: meets });
        });
    }

    render() {
        return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Meet Name</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                    {this.state.data}
                </tbody>
            </table>
        </div>);
    }
}

export default ServerData;
