import Loader from 'react-loader-spinner'
import React, { Component } from 'react'
import { connect } from 'react-redux';

class LoaderCustom extends Component {

    render() {
    const {visibleLoader} = this.props
    return(
        (visibleLoader)
        ?
        <div class="loaderCustom">
            <Loader
            type="Grid"
            color="#FFF"
            height={80}
            width={80}
            />
        </div>
        :
        <>
        </>
        );
    }
}


const mapStateToProps = state => ({
    visibleLoader: state.settings.visibleLoader
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(LoaderCustom);