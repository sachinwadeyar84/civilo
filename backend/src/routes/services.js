/**
 * Service category routes: /api/services
 * Categories ordered by tier: premium services first, basic trades last.
 */

const express = require('express');
const router = express.Router();

const CATEGORIES = [
  { key: 'interior_designer', label: 'Interior Designer', icon: '🏛️', tier: 'premium' },
  { key: 'civil_engineer',    label: 'Civil Engineer',    icon: '🏗️', tier: 'premium' },
  { key: 'land_developer',    label: 'Land Developer',    icon: '🌆', tier: 'premium' },
  { key: 'contractor',        label: 'Contractor',        icon: '🔨', tier: 'core'    },
  { key: 'renovation_expert', label: 'Renovation Expert', icon: '🛠️', tier: 'core'    },
  { key: 'painter',           label: 'Painter',           icon: '🖌️', tier: 'trades'  },
  { key: 'plumber',           label: 'Plumber',           icon: '🔧', tier: 'trades'  },
  { key: 'electrician',       label: 'Electrician',       icon: '⚡', tier: 'trades'  },
];

router.get('/categories', (_req, res) => {
  res.json({ categories: CATEGORIES });
});

module.exports = router;
