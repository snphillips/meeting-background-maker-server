/*
We want to rotate SOME images, but not all.
Why? Some vertical images like patterns and wallpapers
can be rotated horizontally without compromising the 
image. Other images, like vases or portraits, make 
no sense if turned on their side. 

This array is manually created and is a work-in-progress.
As I see images that could be rotated, I add them 
to this list.
*/

module.exports = rotateImageArray = [
  {
    filterTerm: 'accountants',
    rotateListId: [],
  },
  {
    filterTerm: 'thistles',
    rotateListId: ['18345079'],
  },
  {
    filterTerm: 'clams',
    rotateListId: [],
  },
  {
    filterTerm: 'accordion',
    rotateListId: ['18487391'],
  },
  {
    filterTerm: 'movie poster',
    rotateListId: ['18651897'],
  },
  {
    filterTerm: 'art deco',
    rotateListId: ['18699371', '18480025', '18423565', '18650461', '18650537', '18636619'],
  },
  {
    filterTerm: 'art nouveau',
    rotateListId: ['18472693', '18804937'],
  },
  {
    filterTerm: 'bauhaus',
    rotateListId: ['1108749927', '404536663'],
  },
  {
    filterTerm: 'bouquets',
    rotateListId: [
      '18365361',
      '18639451',
      '18365371',
      '18632703',
      '18380853',
      '18462769',
      '18386557',
      '18134323',
      '18647255',
      '18654687',
      '18638667'
    ],
  },
  {
    filterTerm: 'cubism',
    rotateListId: ['18446887', '18486427', '18449275', '18472349'],
  },
  {
    filterTerm: 'gradient',
    rotateListId: [],
  },
  {
    filterTerm: 'mid-century modern',
    rotateListId: ['18637655'],
  },
  {
    filterTerm: 'modern',
    rotateListId: [],
  },
  {
    filterTerm: 'modernism',
    rotateListId: [],
  },
  {
    filterTerm: 'op art',
    rotateListId: [
      '18471659',
      '18404689',
      '18471683',
      '18471355',
      '18471669',
      '18471365',
      '18707877',
      '68776015'
    ],
  },
  {
    filterTerm: 'palm trees',
    rotateListId: ['18445229', '18651415', '18654933'],
  },
  {
    filterTerm: 'pattern',
    rotateListId: ['404536673', '18670433', '907130233', '18462403', '1141959643', '18404203', '18404203'],
  },
  {
    filterTerm: 'postmodern',
    rotateListId: [],
  },
  {
    filterTerm: 'sidewall',
    rotateListId: [
      '18472693',
      '907130233',
      '18404203',
      '18412073',
      '18462403',
      '18694557',
      '18638849',
      '18637993',
      '18655289',
      '18410573',
      '18397383',
      '18637615',
    ],
  },
  {
    filterTerm: 'textile',
    rotateListId: ['68776009', '18647577', '68250821'],
  },
  {
    filterTerm: 'textile design',
    rotateListId: ['18613517'],
  },
  {
    filterTerm: 'wall decoration',
    rotateListId: ['68731103', '18471359', '18471357', '18711607', '18400057'],
  },
  {
    filterTerm: 'wallpaper',
    rotateListId: [
      '1159162409',
      '1108750163',
      '18452157',
      '18452157',
      '18698047',
      '18698047',
      '1159162469',
      '18638119',
      '18398259',
      '18681109',
      '18729989',
      '18638661',
    ],
  },
  {
    filterTerm: 'abstract',
    rotateListId: [
      '1158862499',
      '1158855699',
      '1158862499',
      '1158855699',
      '1158862493',
      '18638639',
      '1158855701',
      '1158855717',
      '1158855689',
      '1158855711',
      '1108760847',
      '18487347',
    ],
  },
  {
    filterTerm: 'decoration',
    rotateListId: ['102335079', '102335113', '102335083', '102335095'],
  },
  {
    filterTerm: 'geometric',
    rotateListId: ['18400915', '18430025', '18484553', '18638977', '18681101', '18384853'],
  },
  {
    filterTerm: 'floral',
    rotateListId: [
      '18340089',
      '18343641',
      '18407699',
      '18423525',
      '18500753',
      '18634019',
      '18637823',
      '18604719',
      '18702575',
      '18804701',
      '18770697',
      '18340061',
      '18462473',
      '18492379',
      '18574879',
      '18798309',
      '18804699',
      '18491019',
      '18475335',
      '18476523',
    ],
  },
  {
    filterTerm: 'flowers',
    rotateListId: ['18634005', '18802443', '18354603', '18354603'],
  },
  {
    filterTerm: 'dots',
    rotateListId: ['18634531', '18770525', '18410723', '18130825', '18440995'],
  },
  {
    filterTerm: 'geometric',
    rotateListId: [
      '18400915',
      '18384853',
      '18400915',
      '18631957',
      '18706541',
      '18423521',
      '18639837',
      '18562521',
      '18391849',
      '18467809',
      '18471665',
    ],
  },
  {
    filterTerm: 'wallcovering',
    rotateListId: [
      '18699759',
      '18572599',
      '18572599',
      '18699759',
      '13340051',
      '18398251',
      '18404567',
      '18340227',
      '18340051',
      '18476557',
      '18136853',
      '18639465',
      '18394655'
    ],
  },
  {
    filterTerm: 'stylized',
    rotateListId: ['18771003', '18471363', '18635539', '18563383'],
  },
  {
    filterTerm: 'fruit',
    rotateListId: ['18617611', '18804529', '18704615', '18800129', '18218907', '18671013'],
  },
  {
    filterTerm: 'science',
    rotateListId: [
      '18617611',
      '18804529',
      '18704615',
      '18800129',
      '18218907',
      '18671013',
      '69192453',
      '69192465',
      '51689411',
      '51689415',
      '68766185',
      '69192465',
      '68766185',
    ],
  },
  {
    filterTerm: 'dining',
    rotateListId: ['18654143', '18654141'],
  },
  {
    filterTerm: 'domestic',
    rotateListId: ['1108798051', '420557245'],
  },
  {
    filterTerm: 'home',
    rotateListId: ['18647577', '18733671', '35520735'],
  },
  {
    filterTerm: 'architecture',
    rotateListId: ['404576393'],
  },
  {
    filterTerm: 'leaves',
    rotateListId: ['18634929', '18469459', '18667383'],
  },
  {
    filterTerm: 'fasion',
    rotateListId: ['18613237', '18354487', '18318821', '404529617'],
  },
  {
    filterTerm: 'African',
    rotateListId: [
      '18471349',
      '18572407',
      '18467873',
      '18467845',
      '18425537',
      '18710399',
      '18423475',
      '18467871',
      '18452269',
    ],
  },
  {
    filterTerm: 'abstraction',
    rotateListId: ['18705347', '18486223'],
  },
  {
    filterTerm: 'circles',
    rotateListId: ['18636035', '18630939'],
  },
  {
    filterTerm: 'color',
    rotateListId: [
      '1108749973',
      '1108749893',
      '18492381',
      '1108749889',
      '51689447',
      '1108749905',
      '1158866093',
    ],
  },
  {
    filterTerm: 'vines',
    rotateListId: ['18423491', '18423479', '51685073', '18191551', '18094763', '18402695'],
  },
];
