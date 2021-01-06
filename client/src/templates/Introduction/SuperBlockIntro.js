import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, navigate } from 'gatsby';
import { uniq, find } from 'lodash';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { withTranslation } from 'react-i18next';
import { Row, Col } from '@freecodecamp/react-bootstrap';

import Login from '../../components/Header/components/Login';
import Map from '../../components/Map';
import CertficationIcon from '../../assets/icons/CertificationIcon';
import GreenPass from '../../assets/icons/GreenPass';
import GreenNotCompleted from '../../assets/icons/GreenNotCompleted';
import { dasherize } from '../../../../utils/slugs';
import Block from './components/Block';
import { FullWidthRow, Spacer } from '../../components/helpers';
import {
  currentChallengeIdSelector,
  isSignedInSelector,
  userSelector
} from '../../redux';
import { resetExpansion, toggleBlock } from './redux';
import {
  MarkdownRemark,
  AllChallengeNode,
  AllMarkdownRemark,
  User
} from '../../redux/propTypes';

import './intro.css';

const propTypes = {
  currentChallengeId: PropTypes.string,
  data: PropTypes.shape({
    markdownRemark: MarkdownRemark,
    allChallengeNode: AllChallengeNode,
    allMarkdownRemark: AllMarkdownRemark
  }),
  expandedState: PropTypes.object,
  isSignedIn: PropTypes.bool,
  resetExpansion: PropTypes.func,
  t: PropTypes.func,
  toggleBlock: PropTypes.func,
  user: User
};

const mapStateToProps = state => {
  return createSelector(
    currentChallengeIdSelector,
    isSignedInSelector,
    userSelector,
    (currentChallengeId, isSignedIn, user) => ({
      currentChallengeId,
      isSignedIn,
      user
    })
  )(state);
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { resetExpansion, toggleBlock: b => toggleBlock(b) },
    dispatch
  );

export class SuperBlockIntroductionPage extends Component {
  constructor(props) {
    super(props);
    this.initializeExpandedState();
  }

  renderBlocks() {
    const {
      data: {
        markdownRemark: {
          frontmatter: { superBlock }
        },
        allChallengeNode: { edges },
        allMarkdownRemark: { edges: mdEdges }
      },
      user: {
        is2018DataVisCert,
        isApisMicroservicesCert,
        isFrontEndLibsCert,
        isQaCertV7,
        isInfosecCertV7,
        isJsAlgoDataStructCert,
        isRespWebDesignCert,
        isSciCompPyCertV7,
        isDataAnalysisPyCertV7,
        isMachineLearningPyCertV7,
        username
      }
    } = this.props;

    const isCertified = {
      'Responsive Web Design': isRespWebDesignCert,
      'JavaScript Algorithms and Data Structures': isJsAlgoDataStructCert,
      'Front End Libraries': isFrontEndLibsCert,
      'Data Visualization': is2018DataVisCert,
      'APIs and Microservices': isApisMicroservicesCert,
      'Quality Assurance': isQaCertV7,
      'Information Security': isInfosecCertV7,
      'Scientific Computing with Python': isSciCompPyCertV7,
      'Data Analysis with Python': isDataAnalysisPyCertV7,
      'Machine Learning with Python': isMachineLearningPyCertV7
    };

    const superBlockDashedName = dasherize(superBlock);
    const certLocation = `/certification/${username}/${superBlockDashedName}`;

    const certIconStyle = { height: '40px', width: '40px' };
    const nodesForSuperBlock = edges.map(({ node }) => node);
    const introNodes = mdEdges.map(({ node }) => node);
    const blockDashedNames = uniq(nodesForSuperBlock.map(({ block }) => block));

    // render all non-empty blocks
    return (
      <ul className='block'>
        {blockDashedNames.map(blockDashedName => (
          <Block
            blockDashedName={blockDashedName}
            challenges={nodesForSuperBlock.filter(
              node => node.block === blockDashedName
            )}
            intro={find(
              introNodes,
              ({ frontmatter: { block } }) =>
                block
                  .toLowerCase()
                  .split(' ')
                  .join('-') === blockDashedName
            )}
            key={blockDashedName}
            superBlockDashedName={superBlockDashedName}
          />
        ))}
        {superBlock !== 'Coding Interview Prep' && (
          <li className='block'>
            <button
              className='map-cert-title'
              onClick={
                isCertified[superBlock] ? () => navigate(certLocation) : null
              }
            >
              <CertficationIcon />
              <h3>{superBlock} Certification</h3>
              <div className='map-title-completed-big'>
                <span>
                  {isCertified[superBlock] ? (
                    <GreenPass style={certIconStyle} />
                  ) : (
                    <GreenNotCompleted style={certIconStyle} />
                  )}
                </span>
              </div>
            </button>
          </li>
        )}
      </ul>
    );
  }

  initializeExpandedState() {
    const {
      resetExpansion,
      data: {
        allChallengeNode: { edges }
      },
      isSignedIn,
      currentChallengeId,
      toggleBlock
    } = this.props;

    resetExpansion();

    let edge;

    if (isSignedIn) {
      // see if currentChallenge is in this superBlock
      edge = edges.find(edge => edge.node.id === currentChallengeId);
    }

    // else, find first block in superBlock
    let i = 0;
    while (!edge && i < 20) {
      // eslint-disable-next-line no-loop-func
      edge = edges.find(edge => edge.node.order === i);
      i++;
    }

    if (edge) toggleBlock(edge.node.block);
  }

  render() {
    const {
      data: {
        markdownRemark: {
          frontmatter: { superBlock }
        }
      },
      isSignedIn,
      t
    } = this.props;
    const superBlockIntroObj = t(`intro:${dasherize(superBlock)}`);
    const {
      title: superBlockTitle,
      image: superBlockImage,
      intro: superBlockIntroText
    } = superBlockIntroObj;

    return (
      <Fragment>
        <Helmet>
          <title>{superBlockTitle} | freeCodeCamp.org</title>
        </Helmet>
        <FullWidthRow className='overflow-fix'>
          <Spacer size={2} />
          <h1 className='text-center'>{superBlockTitle}</h1>
          <Spacer />
          <div style={{ margin: 'auto', maxWidth: '500px' }}>
            <img
              alt='building a website'
              src={superBlockImage}
              style={{
                backgroundColor: '#f5f6f7',
                padding: '15px',
                width: '100%'
              }}
            />
          </div>
          <Spacer />
          {superBlockIntroText.map((str, i) => (
            <p key={i}>{str}</p>
          ))}
          <Spacer size={2} />
          <h2 className='text-center'>Tutorials</h2>
          <div className='block-ui'>{this.renderBlocks()}</div>
          {!isSignedIn && (
            <Row>
              <Col sm={8} smOffset={2} xs={12}>
                <Spacer size={2} />
                <Login block={true}>{t('buttons.logged-out-cta-btn')}</Login>
              </Col>
            </Row>
          )}
          <Spacer size={2} />
          <h2 className='text-center' style={{ whiteSpace: 'pre-line' }}>
            Browse our other free certifications{'\n'}
            (we recommend doing these in order)
          </h2>
          <Spacer />
          <Map currentSuperBlock={superBlock} />
          <Spacer size={2} />
        </FullWidthRow>
      </Fragment>
    );
  }
}

const TranslatedSuperBlockIntroductionPage = withTranslation()(
  SuperBlockIntroductionPage
);

SuperBlockIntroductionPage.displayName = 'SuperBlockIntroductionPage';
SuperBlockIntroductionPage.propTypes = propTypes;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranslatedSuperBlockIntroductionPage);

export const query = graphql`
  query SuperBlockIntroPageBySlug($slug: String!, $superBlock: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        superBlock
      }
    }
    allChallengeNode(
      sort: { fields: [superOrder, order, challengeOrder] }
      filter: { superBlock: { eq: $superBlock } }
    ) {
      edges {
        node {
          fields {
            slug
            blockName
          }
          id
          block
          challengeType
          title
          order
          superBlock
          dashedName
        }
      }
    }
    allMarkdownRemark(
      filter: {
        frontmatter: { block: { ne: null }, superBlock: { eq: $superBlock } }
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            block
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
