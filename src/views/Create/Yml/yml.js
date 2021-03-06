import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { actions } from 'redux/modules/flow'
import { actions as jobActions } from 'redux/modules/job'

import DocumentTitle from 'react-document-title'

import Editor from 'components/CodeEditor'
import Button from 'components/Buttonx'

import classes from './yml.scss'

function mapStateToProps (state, props) {
  const { params: { flowId } } = props
  return {
    flowId,
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    save: actions.saveYml,
    createJob: jobActions.create,
    redirect: push,
  }, dispatch)
}

const defaultYml = '# flow.ci templates\n\nflow:\n  - envs:\n      FLOW_WELCOME_MESSAGE: "hello.world"\n      \n    steps:\n      - name: Init\n        script: |\n          echo ${FLOW_WELCOME_MESSAGE}' // eslint-disable-line

export class FlowYmlSetting extends Component {
  static propTypes = {
    flowId: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired,
    createJob: PropTypes.func.isRequired,
    redirect: PropTypes.func.isRequired,
  }

  state = {
    text: defaultYml
  }

  handleEditorChange = (value) => {
    this.setState({ text: value })
  }

  handleSave = () => {
    const { flowId, save, createJob, redirect } = this.props
    const { text } = this.state
    return save(flowId, text).then(() => {
      return createJob(flowId, 'master')
    }).then(() => {
      redirect(`/flows/${flowId}`)
    })
  }

  render () {
    const { text } = this.state
    return <DocumentTitle title='配置 yml 工作流'>
      <div className={classes.container}>
        <div className={classes.editorwrap}>
          <div className={classes.header}>
            .flow.yml
            <Button type='success' size='sm'
              plain className={classes.save}
              onClick={this.handleSave}>
              保存
            </Button>
          </div>
          <Editor value={text} onChange={this.handleEditorChange} />
        </div>

      </div>
    </DocumentTitle>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlowYmlSetting)
