import React, { Component } from 'react';

import remote from 'remote';

var shell = remote.require('shell');



/*
|--------------------------------------------------------------------------
| Child - Contributors List
|--------------------------------------------------------------------------
*/

export default class ContributorsList extends Component {

    constructor(props) {

        super(props);
        this.state = {};
    }

    render() {

        var self = this;
        var contributors = [
            {
                name: 'Moritz',
                pseudo: 'mrzmyr',
                feature: 'repeat feature',
                url: 'https://github.com/mrzmyr'
            }
        ];

        var contributorsList = contributors.map(function(data, index) {
            return (
                <li key={ index }>{ data.name } (<a href onClick={ self.openLink.bind(null, data.url) }>{ data.pseudo }</a>): { data.feature }</li>
            )
        });

        return (
            <div className='setting setting-music-selector'>
                <h4>Contributors</h4>
                <div className='contributorsx-list'>
                    <p>Made with ♥ by Pierre de la Martinière (<a href onClick={ this.openLink.bind(null, 'http://github.com/KeitIG') }>KeitIG</a>) and a bunch of great guys:</p>
                    <ul>
                        { contributorsList }
                    </ul>
                <div></div>
                </div>
            </div>
        );
    }

    openLink(link, e) {
        e.preventDefault();
        shell.openExternal(link);
    }
}
