/**
 * Tilsenco (https://tilsenco.com).
 *
 * @link https://github.com/tilsenco/tilsenco source repository
 *
 * @copyright Copyright (c) 2022. Tilsenco LLC (https://tilsenco.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { trans } from '$app/common/helpers';
import { t } from 'i18next';
import { toast as helper } from 'react-hot-toast';

class Toast {
  protected declare currentId: string;

  processing(): Toast {
    this.currentId = helper.loading(t('processing', {}), {
      id: this.currentId,
    });

    return this;
  }

  success(message = 'success', replaceable = {}): Toast {
    this.currentId = helper.success(trans(message, replaceable), {
      id: this.currentId,
    });

    return this;
  }

  error(message = 'error_title'): Toast {
    this.currentId = helper.error(t(message), { id: this.currentId });

    return this;
  }

  dismiss(): Toast {
    helper.dismiss(this.currentId);

    return this;
  }
}

export const toast = new Toast();
