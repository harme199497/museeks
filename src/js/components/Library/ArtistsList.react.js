import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import AppActions from '../../actions/AppActions';

import app   from '../../constants/app';
import utils from '../../utils/utils';

import remote from 'remote';

var Menu     = remote.require('menu'),
    MenuItem = remote.require('menu-item');



/*
|--------------------------------------------------------------------------
| Child - ArtistList
|--------------------------------------------------------------------------
*/

export default class ArtistList extends Component {

    constructor(props) {

        super(props);
        this.state = {
            selected : []
        };
    }

    render() {

        var self           = this;
        var selected       = this.state.selected;
        var tracks         = this.props.tracks;
        var trackPlayingID = this.props.trackPlayingID;
        var playing        = null;

        var list = tracks.map(function(track, index) {

            if(trackPlayingID != null) {
                if(track._id == trackPlayingID) var playing = <Icon name='volume-up' fixedWidth />;
                if(track._id == trackPlayingID && app.audio.paused) var playing = <Icon name='volume-off' fixedWidth />;
            }

            return(
                <tr className={ selected.indexOf(track._id) != -1 ? 'track selected' : 'track' } key={ index } onMouseDown={ self.selectTrack.bind(self, track._id, index) } onDoubleClick={ self.selectAndPlay.bind(null, index) } onContextMenu={ self.showContextMenu.bind(self) }>
                    <td className='column-trackPlaying text-center'>
                        { playing }
                    </td>
                    <td className='column-track'>
                        { track.title }
                    </td>
                    <td className='column-duration'>
                        { utils.parseDuration(track.duration) }
                    </td>
                    <td className='column-artist'>
                        { track.artist[0] }
                    </td>
                    <td className='column-album'>
                        { track.album }
                    </td>
                    <td className='column-genre'>
                        { track.genre.join(', ') }
                    </td>
                </tr>
            );
        });

        return (
            <div className='tracks-list-container'>
                <table className='table table-striped tracks-list'>
                    <thead>
                        <tr>
                            <th className='column-trackPlaying'></th>
                            <th className='column-track'>Track</th>
                            <th className='column-duration'>Duration</th>
                            <th className='column-artist'>Artist</th>
                            <th className='column-album'>Album</th>
                            <th className='column-genre'>Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                        { list }
                    </tbody>
                </table>
            </div>
        );
    }

    selectTrack(id, index, e) {

        var self   = this;
        var tracks = this.props.tracks;

        if(e.button == 0 || (e.button == 2 && this.state.selected.indexOf(id) == -1 )) {
            if(e.ctrlKey) { // add one track in selected tracks
                var selected = this.state.selected;
                selected.push(id);
                selected = utils.simpleSort(selected, 'asc');
                this.setState({ selected : selected });
            }
            else if (e.shiftKey) { // add multiple tracks in selected tracks
                var selected = this.state.selected;

                switch(selected.length) {
                    case 0:
                        selected.push(id);
                        this.setState({ selected : selected });
                        break;
                    case 1:
                        var onlySelected = selected[0];
                        var onlySelectedIndex;

                        for(var i = 0, length = tracks.length; i < length; i++) {
                            if(tracks[i]._id === onlySelected) {
                                onlySelectedIndex = i;
                                break;
                            }
                        }

                        if(index < onlySelectedIndex) {
                            for(var i = 1; i <= Math.abs(index - onlySelectedIndex); i++) {
                                selected.push(tracks[onlySelectedIndex - i]._id);
                            }
                        } else if(index > onlySelectedIndex) {
                            for(var i = 1; i <= Math.abs(index - onlySelectedIndex); i++) {
                                selected.push(tracks[onlySelectedIndex + i]._id);
                            }
                        }

                        self.setState({ selected : selected });
                        break;
                    default:
                        var selectedInt = [];

                        for(var i = 0, length = tracks.length; i < length; i++) {
                            if(selected.indexOf(tracks[i]._id) > -1) {
                                selectedInt.push(i);
                            }
                        }

                        var base;
                        var min = Math.min.apply(Math, selectedInt);
                        var max = Math.max.apply(Math, selectedInt);

                        if(index < min) {
                            base = max;
                        } else {
                            base = min;
                        }
                        var newSelected = [];
                        if(index < min) {
                            for(var i = 0; i <= Math.abs(index - base); i++) {
                                newSelected.push(tracks[base - i]._id);
                            }
                        } else if(index > max) {
                            for(var i = 0; i <= Math.abs(index - base); i++) {
                                newSelected.push(tracks[base + i]._id);
                            }
                        }

                        self.setState({ selected : newSelected });
                        break;
                }
            }
            else { // simple select
                var selected = [id];
                this.setState({ selected : selected });
            }
        }
    }

    selectAndPlay(index) {
        AppActions.selectAndPlay(index, false)
    }

    showContextMenu() {

        var selected = this.state.selected;
        var context  = new Menu();

        context.append(new MenuItem({ label: selected.length> 1 ? selected.length + ' tracks selected' : selected.length + ' track selected', enabled: false } ));
        context.append(new MenuItem({ type: 'separator' } ));

        context.append(
            new MenuItem(
                {
                    label : 'Add to queue',
                    click :  function() {
                        AppActions.queue.add(selected)
                    }
                }));
        context.append(
            new MenuItem(
                {
                    label : 'Play next',
                    click :  function() {
                        AppActions.queue.addNext(selected)
                    }
                }));

        context.popup(remote.getCurrentWindow());
    }

    /*cursorUp() {

        var selected = this.state.selected;

        if(selected != null && selected.length >= 1) {
            var selected = [Math.min.apply(Math, selected) - 1];
            if(selected >= 0) this.setState({ selected : selected });
        }
    }

    cursorDown() {

        var selected = this.state.selected;

        if(selected != null && selected.length >= 1) {
            var selected = [Math.max.apply(Math, selected) + 1];
            if(selected < this.props.tracks.length) this.setState({ selected : selected });
        }
    }*/
}
