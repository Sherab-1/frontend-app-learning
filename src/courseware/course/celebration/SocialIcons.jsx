import React from 'react';
import PropTypes from 'prop-types';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share';

import { getConfig } from '@edx/frontend-platform';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useModel } from '../../../model-store';

function SocialIcons({ courseId, intl }) {
  const {
    marketingUrl,
    title,
  } = useModel('courses', courseId);

  if (!marketingUrl) {
    return null;
  }

  const twitterUrl = getConfig().TWITTER_URL;
  const twitterAccount = twitterUrl && twitterUrl.substring(twitterUrl.lastIndexOf('/') + 1);

  const logClick = (service) => {
    const { administrator } = getAuthenticatedUser();
    sendTrackEvent('edx.ui.lms.celebration.social_share.clicked', {
      course_id: courseId,
      is_staff: administrator,
      service,
    });
  };

  return (
    <div className="social-icons">
      { twitterAccount && (
        <TwitterShareButton
          beforeOnClick={() => logClick('twitter')}
          hashtags={['mooc']}
          title={intl.formatMessage(messages.social, { platform: `@${twitterAccount}`, title })}
          url={marketingUrl}
        >
          <TwitterIcon round size={32} />
          <span className="sr-only">{intl.formatMessage(messages.shareService, { service: 'Twitter' })}</span>
        </TwitterShareButton>
      )}
      <FacebookShareButton
        beforeOnClick={() => logClick('facebook')}
        className="ml-2"
        quote={intl.formatMessage(messages.social, { platform: getConfig().SITE_NAME, title })}
        url={marketingUrl}
      >
        <FacebookIcon round size={32} />
        <span className="sr-only">{intl.formatMessage(messages.shareService, { service: 'Facebook' })}</span>
      </FacebookShareButton>
    </div>
  );
}

SocialIcons.propTypes = {
  courseId: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(SocialIcons);