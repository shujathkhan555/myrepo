import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Modal } from '@freecodecamp/react-bootstrap';
import { useStaticQuery, graphql } from 'gatsby';

import ga from '../../../analytics';
import Login from '../../../components/Header/components/Login';
import CompletionModalBody from './CompletionModalBody';

import { dasherize } from '../../../../../utils/slugs';

import './completion-modal.css';

import {
  closeModal,
  submitChallenge,
  completedChallengesIds,
  isCompletionModalOpenSelector,
  successMessageSelector,
  challengeFilesSelector,
  challengeMetaSelector
} from '../redux';

import { isSignedInSelector } from '../../../redux';

const mapStateToProps = createSelector(
  challengeFilesSelector,
  challengeMetaSelector,
  completedChallengesIds,
  isCompletionModalOpenSelector,
  isSignedInSelector,
  successMessageSelector,
  (
    files,
    { title, id },
    completedChallengesIds,
    isOpen,
    isSignedIn,
    message
  ) => ({
    files,
    title,
    id,
    completedChallengesIds,
    isOpen,
    isSignedIn,
    message
  })
);

const mapDispatchToProps = function(dispatch) {
  const dispatchers = {
    close: () => dispatch(closeModal('completion')),
    handleKeypress: e => {
      if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        // Since Hotkeys also listens to Ctrl + Enter we have to stop this event
        // getting to it.
        e.stopPropagation();
        dispatch(submitChallenge());
      }
    },
    submitChallenge: () => {
      dispatch(submitChallenge());
    }
  };
  return () => dispatchers;
};

const propTypes = {
  blockName: PropTypes.string,
  close: PropTypes.func.isRequired,
  completedChallengesIds: PropTypes.array,
  currentBlockIds: PropTypes.array,
  files: PropTypes.object.isRequired,
  handleKeypress: PropTypes.func.isRequired,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  isSignedIn: PropTypes.bool.isRequired,
  message: PropTypes.string,
  submitChallenge: PropTypes.func.isRequired,
  title: PropTypes.string
};

function getCompletedPercent(completedChallengesIds, currentBlockIds, id) {
  if (!completedChallengesIds.includes(id)) {
    completedChallengesIds.push(id);
  }

  const completedChallengesInBlock = completedChallengesIds.filter(id => {
    return currentBlockIds.includes(id);
  });

  const completedPercent = Math.round(
    (completedChallengesInBlock.length / currentBlockIds.length) * 100
  );

  return completedPercent > 100 ? 100 : completedPercent;
}

export class CompletionModalInner extends Component {
  state = {
    downloadURL: null
  };

  static getDerivedStateFromProps(props, state) {
    const { files, isOpen } = props;
    if (!isOpen) {
      return null;
    }
    const { downloadURL } = state;
    if (downloadURL) {
      URL.revokeObjectURL(downloadURL);
    }
    let newURL = null;
    if (Object.keys(files).length) {
      const filesForDownload = Object.keys(files)
        .map(key => files[key])
        .reduce((allFiles, { path, contents }) => {
          const beforeText = `** start of ${path} **\n\n`;
          const afterText = `\n\n** end of ${path} **\n\n`;
          allFiles +=
            files.length > 1 ? beforeText + contents + afterText : contents;
          return allFiles;
        }, '');
      const blob = new Blob([filesForDownload], {
        type: 'text/json'
      });
      newURL = URL.createObjectURL(blob);
    }
    return { downloadURL: newURL };
  }

  componentWillUnmount() {
    if (this.state.downloadURL) {
      URL.revokeObjectURL(this.state.downloadURL);
    }
    this.props.close();
  }

  render() {
    // console.log('CompletionModalProps');
    // console.log(this.props);
    const {
      blockName = '',
      close,
      completedChallengesIds = [],
      currentBlockIds = [],
      id = '',
      isOpen,
      isSignedIn,
      submitChallenge,
      handleKeypress,
      message,
      title
    } = this.props;

    const completedPercent = getCompletedPercent(
      completedChallengesIds,
      currentBlockIds,
      id
    );

    if (isOpen) {
      ga.modalview('/completion-modal');
    }
    const dashedName = dasherize(title);
    return (
      <Modal
        animation={false}
        bsSize='lg'
        dialogClassName='challenge-success-modal'
        keyboard={true}
        onHide={close}
        onKeyDown={isOpen ? handleKeypress : noop}
        show={isOpen}
      >
        <Modal.Header
          className='challenge-list-header fcc-modal'
          closeButton={true}
        >
          <Modal.Title className='completion-message'>{message}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='completion-modal-body'>
          <CompletionModalBody
            blockName={blockName}
            completedPercent={completedPercent}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block={true}
            bsSize='large'
            bsStyle='primary'
            onClick={submitChallenge}
          >
            {isSignedIn ? 'Submit and g' : 'G'}o to next challenge{' '}
            <span className='hidden-xs'>(Ctrl + Enter)</span>
          </Button>
          {isSignedIn ? null : (
            <Login
              block={true}
              bsSize='lg'
              bsStyle='primary'
              className='btn-invert'
            >
              Sign in to save your progress
            </Login>
          )}
          {this.state.downloadURL ? (
            <Button
              block={true}
              bsSize='lg'
              bsStyle='primary'
              className='btn-invert'
              download={`${dashedName}.txt`}
              href={this.state.downloadURL}
            >
              Download my solution
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    );
  }
}

CompletionModalInner.propTypes = propTypes;

const useCurrentBlockIds = blockName => {
  const {
    allChallengeNode: { edges }
  } = useStaticQuery(graphql`
    query getCurrentBlockNodes {
      allChallengeNode(sort: { fields: [superOrder, order, challengeOrder] }) {
        edges {
          node {
            fields {
              blockName
            }
            id
          }
        }
      }
    }
  `);

  const currentBlockIds = edges
    .filter(edge => edge.node.fields.blockName === blockName)
    .map(edge => edge.node.id);
  return currentBlockIds;
};

const CompletionModal = props => {
  const currentBlockIds = useCurrentBlockIds(props.blockName || '');
  return <CompletionModalInner currentBlockIds={currentBlockIds} {...props} />;
};

CompletionModal.displayName = 'CompletionModal';
CompletionModal.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletionModal);
