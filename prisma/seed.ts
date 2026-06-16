import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database ...')

  // ─── Clear existing data (order matters for FK constraints) ───
  await prisma.auditLog.deleteMany()
  await prisma.followupRecord.deleteMany()
  await prisma.dischargePlan.deleteMany()
  await prisma.caseEvent.deleteMany()
  await prisma.task.deleteMany()
  await prisma.qrCode.deleteMany()
  await prisma.emergencyCard.deleteMany()
  await prisma.trustedContact.deleteMany()
  await prisma.voiceRecord.deleteMany()
  await prisma.summary.deleteMany()
  await prisma.consent.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.elderProfile.deleteMany()
  await prisma.user.deleteMany()

  // ─── Hash the common password ───
  const passwordHash = await bcrypt.hash('123456', 10)

  // ════════════════════════════════════════════
  // 1. Users (14 records)
  // ════════════════════════════════════════════
  const usersData = [
    { id: 'u1',  name: '张奶奶',   phone: '13800001001', role: 'elderly',    organization: '',                    community: '雨花社区',   status: 'active', createdAt: '2024-09-01', lastLogin: '2024-12-15' },
    { id: 'u2',  name: '李爷爷',   phone: '13800001002', role: 'elderly',    organization: '',                    community: '东山社区',   status: 'active', createdAt: '2024-09-05', lastLogin: '2024-11-20' },
    { id: 'u3',  name: '王阿姨',   phone: '13800001003', role: 'family',     organization: '',                    community: '雨花社区',   status: 'active', createdAt: '2024-09-02', lastLogin: '2024-12-16' },
    { id: 'u4',  name: '李建国',   phone: '13800001004', role: 'family',     organization: '',                    community: '东山社区',   status: 'active', createdAt: '2024-09-08', lastLogin: '2024-12-10' },
    { id: 'u5',  name: '刘社工',   phone: '13800001005', role: 'community',  organization: '雨花社区服务中心',     community: '雨花社区',   status: 'active', createdAt: '2024-08-15', lastLogin: '2024-12-17' },
    { id: 'u6',  name: '陈志愿者', phone: '13800001006', role: 'community',  organization: '东山社区服务中心',     community: '东山社区',   status: 'active', createdAt: '2024-08-20', lastLogin: '2024-12-16' },
    { id: 'u7',  name: '赵社工',   phone: '13800001007', role: 'community',  organization: '玄武湖社区服务中心',   community: '玄武湖社区', status: 'active', createdAt: '2024-08-18', lastLogin: '2024-12-15' },
    { id: 'u8',  name: '周医生',   phone: '13800001008', role: 'hospital_sw', organization: '市中心医院',           community: '',            status: 'active', createdAt: '2024-09-10', lastLogin: '2024-12-14' },
    { id: 'u9',  name: '吴护士',   phone: '13800001009', role: 'hospital_sw', organization: '市第一人民医院',       community: '',            status: 'active', createdAt: '2024-09-12', lastLogin: '2024-12-13' },
    { id: 'u10', name: '康护护理站', phone: '13800001010', role: 'provider', organization: '康护护理服务公司',     community: '',            status: 'active', createdAt: '2024-09-20', lastLogin: '2024-12-12' },
    { id: 'u11', name: '益心公益',  phone: '13800001011', role: 'provider',  organization: '益心公益服务中心',     community: '',            status: 'active', createdAt: '2024-09-22', lastLogin: '2024-12-10' },
    { id: 'u12', name: '马管理员', phone: '13800001012', role: 'admin',      organization: '项目组',               community: '',            status: 'active', createdAt: '2024-08-01', lastLogin: '2024-12-17' },
    { id: 'u13', name: '孙督导',   phone: '13800001013', role: 'admin',      organization: '项目组',               community: '',            status: 'active', createdAt: '2024-08-01', lastLogin: '2024-12-16' },
    { id: 'u14', name: '黄老人',   phone: '13800001014', role: 'elderly',    organization: '',                    community: '玄武湖社区', status: 'active', createdAt: '2024-09-15', lastLogin: '2024-10-20' },
  ]

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        phone: u.phone,
        passwordHash,
        role: u.role,
        organization: u.organization,
        community: u.community,
        status: u.status,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.createdAt),
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
      },
    })
  }
  console.log(`  Created ${usersData.length} users`)

  // ════════════════════════════════════════════
  // 2. ElderProfiles (15 records)
  // ════════════════════════════════════════════
  const eldersData = [
    { id: 'e1',  name: '张秀英', gender: 'female', age: 76,  livingStatus: 'alone',        community: '雨花社区',   address: '雨花新村1号101室', phone: '13800001001', medicalHistory: '高血压、糖尿病',              emergencyNotes: '需按时服用降压药和降糖药，对青霉素过敏',                                                      communicationPref: '希望由女儿协助沟通医疗事务',                                        carePref: '出院后希望回家休养，有上门护理更好',                     aidNeeds: '担心长期护理费用，希望了解医疗救助政策',                riskLevel: 'medium', status: 'completed',   createdBy: 'u5', createdAt: '2024-09-10', updatedAt: '2024-11-15' },
    { id: 'e2',  name: '李大勇', gender: 'male',   age: 82,  livingStatus: 'alone',        community: '东山社区',   address: '东山花园5号201室', phone: '13800001002', medicalHistory: '冠心病、关节炎',              emergencyNotes: '曾有心梗史，随身携带硝酸甘油',                                                                  communicationPref: '听力下降，希望面对面沟通或由儿子代为传达',                          carePref: '出院后需要短期陪护，行动不便需要助行器',               aidNeeds: '需要了解老年人助行器申请渠道',                          riskLevel: 'high',   status: 'completed',   createdBy: 'u6', createdAt: '2024-09-05', updatedAt: '2024-10-20' },
    { id: 'e3',  name: '王淑芬', gender: 'female', age: 71,  livingStatus: 'with_spouse',  community: '雨花社区',   address: '雨花新村3号302室', phone: '',              medicalHistory: '高血脂',                         emergencyNotes: '',                                                                                                                                  communicationPref: '可由老伴协助沟通',                                              carePref: '选择社区上门服务',                                   aidNeeds: '',                                                                          riskLevel: 'low',    status: 'completed',   createdBy: 'u5', createdAt: '2024-09-12', updatedAt: '2024-11-01' },
    { id: 'e4',  name: '张德明', gender: 'male',   age: 79,  livingStatus: 'alone',        community: '玄武湖社区', address: '玄武湖路10号102室', phone: '',              medicalHistory: '慢性支气管炎、高血压',           emergencyNotes: '冬季易发呼吸道感染',                                                                              communicationPref: '说话慢一点即可，不需特别辅助',                                    carePref: '倾向社区医院就近就医',                                 aidNeeds: '冬季需要更多上门探访',                                riskLevel: 'medium', status: 'completed',   createdBy: 'u7', createdAt: '2024-09-18', updatedAt: '2024-10-30' },
    { id: 'e5',  name: '赵文英', gender: 'female', age: 85,  livingStatus: 'alone',        community: '雨花社区',   address: '雨花新村7号501室', phone: '',              medicalHistory: '糖尿病、骨质疏松',               emergencyNotes: '曾因低血糖晕倒，需注意血糖监测',                                                                communicationPref: '视力较差，需要大字版材料',                                        carePref: '需要专业护理，考虑入住养老机构',                       aidNeeds: '需要了解养老机构评估标准',                              riskLevel: 'high',   status: 'completed',   createdBy: 'u5', createdAt: '2024-09-15', updatedAt: '2024-11-20' },
    { id: 'e6',  name: '刘建国', gender: 'male',   age: 68,  livingStatus: 'with_family',  community: '东山社区',   address: '东山花园8号301室', phone: '',              medicalHistory: '',                               emergencyNotes: '',                                                                                                                                  communicationPref: '自理能力强，自主沟通',                                          carePref: '优先选择日间照料中心',                                 aidNeeds: '',                                                                          riskLevel: 'low',    status: 'completed',   createdBy: 'u6', createdAt: '2024-09-20', updatedAt: '2024-10-15' },
    { id: 'e7',  name: '陈桂芳', gender: 'female', age: 73,  livingStatus: 'alone',        community: '玄武湖社区', address: '玄武湖路15号203室', phone: '',              medicalHistory: '高血压',                         emergencyNotes: '',                                                                                                                                  communicationPref: '普通话交流即可',                                                carePref: '居家照护',                                         aidNeeds: '需要助餐服务信息',                                    riskLevel: 'low',    status: 'completed',   createdBy: 'u7', createdAt: '2024-09-22', updatedAt: '2024-10-25' },
    { id: 'e8',  name: '周大爷', gender: 'male',   age: 91,  livingStatus: 'alone',        community: '雨花社区',   address: '雨花新村2号101室', phone: '',              medicalHistory: '帕金森病、听力减退',             emergencyNotes: '行动非常不便，需要拐杖辅助',                                                                      communicationPref: '需要大声说话，有时需要写下来',                                    carePref: '需要全天候照护，正在申请居家养老服务',                 aidNeeds: '急需评估是否适用长期护理保险',                          riskLevel: 'high',   status: 'completed',   createdBy: 'u5', createdAt: '2024-09-08', updatedAt: '2024-11-10' },
    { id: 'e9',  name: '马秀兰', gender: 'female', age: 77,  livingStatus: 'with_spouse',  community: '东山社区',   address: '东山花园12号502室', phone: '',              medicalHistory: '白内障术后',                      emergencyNotes: '',                                                                                                                                  communicationPref: '正常沟通，需要稍大声',                                            carePref: '倾向社区健康讲座和体检',                               aidNeeds: '',                                                                          riskLevel: 'low',    status: 'draft',        createdBy: 'u6', createdAt: '2024-11-01', updatedAt: '2024-11-01' },
    { id: 'e10', name: '胡老人', gender: 'male',   age: 80,  livingStatus: 'institution',  community: '玄武湖社区', address: '玄武湖养老院A栋103', phone: '',             medicalHistory: '老年痴呆早期',                    emergencyNotes: '认知能力下降，需要监护人陪同',                                                                  communicationPref: '由养老院工作人员协助沟通',                                      carePref: '已在养老院居住，需要定期评估',                           aidNeeds: '',                                                                          riskLevel: 'medium', status: 'pending_confirm', createdBy: 'u7', createdAt: '2024-11-05', updatedAt: '2024-11-05' },
    { id: 'e11', name: '冯奶奶', gender: 'female', age: 88,  livingStatus: 'alone',        community: '雨花社区',   address: '雨花新村9号202室', phone: '',              medicalHistory: '脑梗后遗症、高血压',             emergencyNotes: '左半身偏瘫，需要轮椅',                                                                              communicationPref: '表达有些不清晰，建议有家属陪同',                                  carePref: '需要专业康复护理',                                     aidNeeds: '需要了解康复医疗资源',                                riskLevel: 'high',   status: 'completed',   createdBy: 'u5', createdAt: '2024-09-25', updatedAt: '2024-10-20' },
    { id: 'e12', name: '曹大爷', gender: 'male',   age: 75,  livingStatus: 'alone',        community: '东山社区',   address: '东山花园3号402室', phone: '',              medicalHistory: '糖尿病',                          emergencyNotes: '',                                                                                                                                  communicationPref: '正常交流',                                                      carePref: '就近社区医疗',                                       aidNeeds: '需要了解糖尿病饮食指导',                              riskLevel: 'medium', status: 'completed',   createdBy: 'u6', createdAt: '2024-09-28', updatedAt: '2024-10-15' },
    { id: 'e13', name: '许阿姨', gender: 'female', age: 83,  livingStatus: 'alone',        community: '玄武湖社区', address: '玄武湖路22号101室', phone: '',              medicalHistory: '冠心病、高血压、关节炎',         emergencyNotes: '心功能不全，避免剧烈活动',                                                                          communicationPref: '听力有些下降，说话要慢',                                        carePref: '希望社区能定期上门探望',                               aidNeeds: '冬季御寒物资需求',                                    riskLevel: 'high',   status: 'completed',   createdBy: 'u7', createdAt: '2024-10-01', updatedAt: '2024-11-05' },
    { id: 'e14', name: '董先生', gender: 'male',   age: 70,  livingStatus: 'with_spouse',  community: '雨花社区',   address: '雨花新村6号301室', phone: '',              medicalHistory: '',                               emergencyNotes: '',                                                                                                                                  communicationPref: '自理能力强',                                                    carePref: '倾向主动健康管理',                                     aidNeeds: '',                                                                          riskLevel: 'low',    status: 'completed',   createdBy: 'u5', createdAt: '2024-10-05', updatedAt: '2024-10-10' },
    { id: 'e15', name: '金婆婆', gender: 'female', age: 89,  livingStatus: 'alone',        community: '东山社区',   address: '东山花园15号103室', phone: '',             medicalHistory: '多种慢病共存',                    emergencyNotes: '独居，建议优先关注',                                                                              communicationPref: '只会讲方言，需要同乡志愿者协助',                                  carePref: '希望有本地志愿者定期探访',                             aidNeeds: '需要多方面社会救助信息',                              riskLevel: 'high',   status: 'completed',   createdBy: 'u6', createdAt: '2024-10-08', updatedAt: '2024-11-12' },
  ]

  for (const e of eldersData) {
    await prisma.elderProfile.create({
      data: {
        id: e.id,
        name: e.name,
        gender: e.gender,
        age: e.age,
        livingStatus: e.livingStatus,
        community: e.community,
        address: e.address,
        phone: e.phone,
        medicalHistory: e.medicalHistory,
        emergencyNotes: e.emergencyNotes,
        communicationPref: e.communicationPref,
        carePref: e.carePref,
        aidNeeds: e.aidNeeds,
        riskLevel: e.riskLevel,
        status: e.status,
        createdById: e.createdBy,
        createdAt: new Date(e.createdAt),
        updatedAt: new Date(e.updatedAt),
      },
    })
  }
  console.log(`  Created ${eldersData.length} elder profiles`)

  // ════════════════════════════════════════════
  // 3. TrustedContacts (24 records)
  // ════════════════════════════════════════════
  const contactsData = [
    { id: 'c1',  elderId: 'e1',  name: '张明',             relation: '女儿',           phone: '13900001001', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c2',  elderId: 'e1',  name: '雨花社区网格员',    relation: '社区工作人员',    phone: '13900001002', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
    { id: 'c3',  elderId: 'e2',  name: '李小明',           relation: '儿子',           phone: '13900001003', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c4',  elderId: 'e2',  name: '东山社区网格员',    relation: '社区工作人员',    phone: '13900001004', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
    { id: 'c5',  elderId: 'e3',  name: '王国强',           relation: '丈夫',           phone: '13900001005', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c6',  elderId: 'e3',  name: '王小明',           relation: '儿子',           phone: '13900001006', priority: 2, verifiedStatus: 'pending',  canMakeDecision: true  },
    { id: 'c7',  elderId: 'e4',  name: '张丽',             relation: '女儿',           phone: '13900001007', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c8',  elderId: 'e5',  name: '赵强',             relation: '儿子',           phone: '13900001008', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c9',  elderId: 'e5',  name: '赵芳',             relation: '女儿',           phone: '13900001009', priority: 2, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c10', elderId: 'e6',  name: '刘丽',             relation: '妻子',           phone: '13900001010', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c11', elderId: 'e7',  name: '陈强',             relation: '儿子',           phone: '13900001011', priority: 1, verifiedStatus: 'pending',  canMakeDecision: true  },
    { id: 'c12', elderId: 'e8',  name: '周华',             relation: '女儿',           phone: '13900001012', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c13', elderId: 'e8',  name: '雨花社区网格员',    relation: '社区工作人员',    phone: '13900001002', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
    { id: 'c14', elderId: 'e9',  name: '马建国',           relation: '丈夫',           phone: '13900001013', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c15', elderId: 'e10', name: '玄武湖养老院客服',  relation: '机构管理人员',    phone: '13900001014', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c16', elderId: 'e10', name: '胡小军',           relation: '儿子',           phone: '13900001015', priority: 2, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c17', elderId: 'e11', name: '冯刚',             relation: '儿子',           phone: '13900001016', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c18', elderId: 'e11', name: '雨花社区网格员',    relation: '社区工作人员',    phone: '13900001002', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
    { id: 'c19', elderId: 'e12', name: '曹丽',             relation: '女儿',           phone: '13900001017', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c20', elderId: 'e13', name: '许明',             relation: '儿子',           phone: '13900001018', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c21', elderId: 'e13', name: '玄武湖社区网格员',  relation: '社区工作人员',    phone: '13900001019', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
    { id: 'c22', elderId: 'e14', name: '董太太',           relation: '妻子',           phone: '13900001020', priority: 1, verifiedStatus: 'verified', canMakeDecision: true  },
    { id: 'c23', elderId: 'e15', name: '金明',             relation: '儿子',           phone: '13900001021', priority: 1, verifiedStatus: 'pending',  canMakeDecision: true  },
    { id: 'c24', elderId: 'e15', name: '东山社区网格员',    relation: '社区工作人员',    phone: '13900001004', priority: 2, verifiedStatus: 'verified', canMakeDecision: false },
  ]

  for (const c of contactsData) {
    await prisma.trustedContact.create({
      data: {
        id: c.id,
        elderId: c.elderId,
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        priority: c.priority,
        verifiedStatus: c.verifiedStatus,
        canMakeDecision: c.canMakeDecision,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01'),
      },
    })
  }
  console.log(`  Created ${contactsData.length} trusted contacts`)

  // ════════════════════════════════════════════
  // 4. EmergencyCards (13 records)
  // ════════════════════════════════════════════
  const cardsData = [
    { id: 'card1',  elderId: 'e1',  cardNo: 'YHY20240001', qrToken: 'token-e1-2024',  visibilityLevel: 'contact', emergencyNote: '紧急联系人详见卡片背面',                     status: 'active', createdAt: '2024-09-15', printedAt: '2024-09-16' },
    { id: 'card2',  elderId: 'e2',  cardNo: 'YHY20240002', qrToken: 'token-e2-2024',  visibilityLevel: 'contact', emergencyNote: '曾有心梗史，随身携带硝酸甘油',                 status: 'active', createdAt: '2024-09-10', printedAt: '2024-09-11' },
    { id: 'card3',  elderId: 'e3',  cardNo: 'YHY20240003', qrToken: 'token-e3-2024',  visibilityLevel: 'minimal', emergencyNote: '',                                          status: 'active', createdAt: '2024-09-18', printedAt: '2024-09-19' },
    { id: 'card4',  elderId: 'e4',  cardNo: 'YHY20240004', qrToken: 'token-e4-2024',  visibilityLevel: 'contact', emergencyNote: '冬季易发呼吸道感染',                           status: 'active', createdAt: '2024-09-22', printedAt: '2024-09-23' },
    { id: 'card5',  elderId: 'e5',  cardNo: 'YHY20240005', qrToken: 'token-e5-2024',  visibilityLevel: 'contact', emergencyNote: '视力较差，请注意协助',                         status: 'active', createdAt: '2024-09-20', printedAt: '2024-09-21' },
    { id: 'card6',  elderId: 'e6',  cardNo: 'YHY20240006', qrToken: 'token-e6-2024',  visibilityLevel: 'minimal', emergencyNote: '',                                          status: 'active', createdAt: '2024-09-25', printedAt: '2024-09-26' },
    { id: 'card7',  elderId: 'e7',  cardNo: 'YHY20240007', qrToken: 'token-e7-2024',  visibilityLevel: 'minimal', emergencyNote: '',                                          status: 'active', createdAt: '2024-09-28', printedAt: null         },
    { id: 'card8',  elderId: 'e8',  cardNo: 'YHY20240008', qrToken: 'token-e8-2024',  visibilityLevel: 'contact', emergencyNote: '行动不便需拐杖辅助',                           status: 'active', createdAt: '2024-09-15', printedAt: '2024-09-16' },
    { id: 'card9',  elderId: 'e11', cardNo: 'YHY20240009', qrToken: 'token-e11-2024', visibilityLevel: 'contact', emergencyNote: '左半身偏瘫需轮椅',                             status: 'active', createdAt: '2024-10-01', printedAt: '2024-10-02' },
    { id: 'card10', elderId: 'e12', cardNo: 'YHY20240010', qrToken: 'token-e12-2024', visibilityLevel: 'minimal', emergencyNote: '',                                          status: 'active', createdAt: '2024-11-01', printedAt: null         },
    { id: 'card11', elderId: 'e13', cardNo: 'YHY20240011', qrToken: 'token-e13-2024', visibilityLevel: 'contact', emergencyNote: '心功能不全，避免剧烈活动',                     status: 'active', createdAt: '2024-10-10', printedAt: '2024-10-11' },
    { id: 'card12', elderId: 'e14', cardNo: 'YHY20240012', qrToken: 'token-e14-2024', visibilityLevel: 'minimal', emergencyNote: '',                                          status: 'active', createdAt: '2024-10-15', printedAt: null         },
    { id: 'card13', elderId: 'e15', cardNo: 'YHY20240013', qrToken: 'token-e15-2024', visibilityLevel: 'contact', emergencyNote: '独居，只会讲方言',                             status: 'active', createdAt: '2024-10-20', printedAt: '2024-10-21' },
  ]

  for (const card of cardsData) {
    await prisma.emergencyCard.create({
      data: {
        id: card.id,
        elderId: card.elderId,
        cardNo: card.cardNo,
        qrToken: card.qrToken,
        visibilityLevel: card.visibilityLevel,
        emergencyNote: card.emergencyNote,
        status: card.status,
        createdAt: new Date(card.createdAt),
        printedAt: card.printedAt ? new Date(card.printedAt) : null,
        updatedAt: new Date(card.createdAt),
      },
    })
  }
  console.log(`  Created ${cardsData.length} emergency cards`)

  // ════════════════════════════════════════════
  // 5. Tasks (15 records)
  // ════════════════════════════════════════════
  const tasksData = [
    { id: 't1',  elderId: 'e1',  taskType: 'followup',           title: '季度回访',                description: '进行第四季度回访，更新档案信息',                                         status: 'todo',       priority: 2, assigneeId: 'u5', dueDate: '2024-12-25', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-15' },
    { id: 't2',  elderId: 'e2',  taskType: 'emergency_response', title: '应急响应跟进',             description: '张大爷在心电图异常后入院，需核实联系人是否已通知',                             status: 'in_progress', priority: 4, assigneeId: 'u6', dueDate: '2024-12-18', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-17' },
    { id: 't3',  elderId: 'e5',  taskType: 'discharge_pickup',   title: '出院接送安排',             description: '赵奶奶计划12月20日出院，需安排接送车辆',                                       status: 'todo',       priority: 3, assigneeId: 'u5', dueDate: '2024-12-20', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-16' },
    { id: 't4',  elderId: 'e8',  taskType: 'revisit',            title: '上门探访',                description: '本月例行上门探访，检查生活状况',                                               status: 'todo',       priority: 2, assigneeId: 'u5', dueDate: '2024-12-28', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-17' },
    { id: 't5',  elderId: 'e11', taskType: 'medication_reminder', title: '用药提醒',                description: '提醒按时服药，了解康复进展',                                                   status: 'done',       priority: 3, assigneeId: 'u5', dueDate: '2024-12-15', completedAt: '2024-12-14', completionNote: '已电话联系，冯奶奶表示按时服药，康复良好',                      createdAt: '2024-12-10' },
    { id: 't6',  elderId: 'e13', taskType: 'followup',           title: '冬季关怀回访',             description: '冬季特别回访，确认御寒物资是否充足',                                             status: 'todo',       priority: 3, assigneeId: 'u7', dueDate: '2024-12-22', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-16' },
    { id: 't7',  elderId: 'e15', taskType: 'intake_review',      title: '联系人验证',              description: '联系金婆婆儿子金明，确认联系方式有效性',                                         status: 'overdue',    priority: 3, assigneeId: 'u6', dueDate: '2024-12-10', completedAt: null,        completionNote: null,                                                          createdAt: '2024-11-25' },
    { id: 't8',  elderId: 'e4',  taskType: 'followup',           title: '例行回访',                description: '冬季健康回访，关注呼吸道状况',                                                   status: 'todo',       priority: 2, assigneeId: 'u7', dueDate: '2024-12-28', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-17' },
    { id: 't9',  elderId: 'e3',  taskType: 'followup',           title: '季度回访',                description: '了解近期身体状况和照护需求',                                                     status: 'in_progress', priority: 1, assigneeId: 'u5', dueDate: '2024-12-24', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-14' },
    { id: 't10', elderId: 'e9',  taskType: 'intake_review',      title: '建档审核',                description: '审核马秀兰草稿档案，补充完整后提交确认',                                           status: 'todo',       priority: 2, assigneeId: 'u6', dueDate: '2024-12-20', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-15' },
    { id: 't11', elderId: 'e10', taskType: 'intake_review',      title: '信息确认',                description: '协助养老院工作人员确认档案信息',                                                 status: 'todo',       priority: 2, assigneeId: 'u7', dueDate: '2024-12-22', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-17' },
    { id: 't12', elderId: 'e12', taskType: 'medication_reminder', title: '糖尿病饮食指导',           description: '联系营养资源方，提供糖尿病饮食指导材料',                                           status: 'done',       priority: 2, assigneeId: 'u6', dueDate: '2024-12-10', completedAt: '2024-12-08', completionNote: '已提供饮食指导手册',                                            createdAt: '2024-12-01' },
    { id: 't13', elderId: 'e2',  taskType: 'discharge_pickup',   title: '出院后回访',              description: '张大爷上周出院后需回访了解恢复情况',                                             status: 'done',       priority: 3, assigneeId: 'u6', dueDate: '2024-12-14', completedAt: '2024-12-13', completionNote: '已上门回访，恢复良好，儿子已安排陪护',                          createdAt: '2024-12-08' },
    { id: 't14', elderId: 'e7',  taskType: 'other',              title: '助餐服务对接',            description: '联系社区助餐点，为陈桂芳安排送餐服务',                                             status: 'in_progress', priority: 1, assigneeId: 'u7', dueDate: '2024-12-30', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-12' },
    { id: 't15', elderId: 'e11', taskType: 'revisit',            title: '康复进展评估',            description: '评估左侧肢体康复训练进展',                                                       status: 'todo',       priority: 3, assigneeId: 'u5', dueDate: '2024-12-26', completedAt: null,        completionNote: null,                                                          createdAt: '2024-12-17' },
  ]

  for (const t of tasksData) {
    await prisma.task.create({
      data: {
        id: t.id,
        elderId: t.elderId,
        taskType: t.taskType,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assigneeId: t.assigneeId,
        dueDate: new Date(t.dueDate),
        completedAt: t.completedAt ? new Date(t.completedAt) : null,
        completionNote: t.completionNote,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.createdAt),
      },
    })
  }
  console.log(`  Created ${tasksData.length} tasks`)

  // ════════════════════════════════════════════
  // 6. CaseEvents (8 records)
  // ════════════════════════════════════════════
  const casesData = [
    { id: 'case1', elderId: 'e2',  triggerType: 'scan',     description: '张大爷因胸痛被邻居送至市中心医院急诊，医院社工扫码获取紧急联系人信息',  status: 'open',     severity: 4, assigneeId: 'u6', resolvedAt: null,                  createdAt: '2024-12-17' },
    { id: 'case2', elderId: 'e5',  triggerType: 'manual',   description: '赵奶奶因血糖控制不佳住院治疗，现已准备出院',                          status: 'open',     severity: 3, assigneeId: 'u5', resolvedAt: null,                  createdAt: '2024-12-16' },
    { id: 'case3', elderId: 'e1',  triggerType: 'followup', description: '回访中张奶奶反馈近期血压不稳定，已建议就医',                          status: 'resolved', severity: 2, assigneeId: 'u5', resolvedAt: '2024-12-12',         createdAt: '2024-12-10' },
    { id: 'case4', elderId: 'e8',  triggerType: 'scan',     description: '周大爷在家摔倒，邻居拨打120，医院社工扫码联系其女儿',                 status: 'resolved', severity: 4, assigneeId: 'u5', resolvedAt: '2024-12-05',         createdAt: '2024-12-01' },
    { id: 'case5', elderId: 'e15', triggerType: 'manual',   description: '金婆婆向社区反映冬季生活困难，需要物资支持',                          status: 'open',     severity: 3, assigneeId: 'u6', resolvedAt: null,                  createdAt: '2024-12-14' },
    { id: 'case6', elderId: 'e11', triggerType: 'followup', description: '冯奶奶表示康复训练效果不理想，希望调整方案',                          status: 'resolved', severity: 2, assigneeId: 'u5', resolvedAt: '2024-12-09',         createdAt: '2024-12-05' },
    { id: 'case7', elderId: 'e4',  triggerType: 'manual',   description: '张大爷反映冬季取暖设备故障',                                        status: 'closed',   severity: 2, assigneeId: 'u7', resolvedAt: '2024-12-01',         createdAt: '2024-11-28' },
    { id: 'case8', elderId: 'e13', triggerType: 'scan',     description: '许阿姨在社区活动时突感不适，志愿者扫码查看信息',                      status: 'resolved', severity: 3, assigneeId: 'u7', resolvedAt: '2024-12-09',         createdAt: '2024-12-08' },
  ]

  for (const c of casesData) {
    await prisma.caseEvent.create({
      data: {
        id: c.id,
        elderId: c.elderId,
        triggerType: c.triggerType,
        description: c.description,
        status: c.status,
        severity: c.severity,
        assigneeId: c.assigneeId,
        resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : null,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.createdAt),
      },
    })
  }
  console.log(`  Created ${casesData.length} case events`)

  // ════════════════════════════════════════════
  // 7. DischargePlans (4 records)
  // ════════════════════════════════════════════
  const dischargesData = [
    { id: 'd1', elderId: 'e2',  caseId: 'case1', hospitalName: '市中心医院',       dischargeDate: '2024-12-20', pickupStatus: 'pending',     medicationReminderStatus: 'pending',     revisitStatus: 'pending',     visitStatus: 'pending',     assigneeId: 'u6', notes: '需安排车辆接送，出院后需社区志愿者定期探访',                                    createdAt: '2024-12-17' },
    { id: 'd2', elderId: 'e5',  caseId: 'case2', hospitalName: '市第一人民医院',   dischargeDate: '2024-12-20', pickupStatus: 'completed',  medicationReminderStatus: 'pending',     revisitStatus: 'pending',     visitStatus: 'not_needed',  assigneeId: 'u5', notes: '子女已安排接送，需提醒出院用药注意事项',                                        createdAt: '2024-12-16' },
    { id: 'd3', elderId: 'e8',  caseId: 'case4', hospitalName: '市中医院',         dischargeDate: '2024-12-06', pickupStatus: 'completed',  medicationReminderStatus: 'completed',   revisitStatus: 'completed',   visitStatus: 'completed',   assigneeId: 'u5', notes: '女儿已全程陪同，出院后恢复良好',                                              createdAt: '2024-12-02' },
    { id: 'd4', elderId: 'e11', caseId: 'case6', hospitalName: '市中心医院',       dischargeDate: '2024-12-10', pickupStatus: 'completed',  medicationReminderStatus: 'completed',   revisitStatus: 'completed',   visitStatus: 'pending',     assigneeId: 'u5', notes: '儿子已安排接送，需要持续关注康复训练',                                          createdAt: '2024-12-06' },
  ]

  for (const d of dischargesData) {
    await prisma.dischargePlan.create({
      data: {
        id: d.id,
        elderId: d.elderId,
        caseId: d.caseId,
        hospitalName: d.hospitalName,
        dischargeDate: new Date(d.dischargeDate),
        pickupStatus: d.pickupStatus,
        medicationReminderStatus: d.medicationReminderStatus,
        revisitStatus: d.revisitStatus,
        visitStatus: d.visitStatus,
        assigneeId: d.assigneeId,
        notes: d.notes,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.createdAt),
      },
    })
  }
  console.log(`  Created ${dischargesData.length} discharge plans`)

  // ════════════════════════════════════════════
  // 8. FollowupRecords (10 records)
  // ════════════════════════════════════════════
  const followupsData = [
    { id: 'f1',  elderId: 'e1',  caseId: null,    type: 'phone', status: 'scheduled', scheduledDate: '2024-12-25', completedAt: null,               result: '',                                                                       satisfaction: null, nextAction: '更新档案信息',                     assigneeId: 'u5', createdAt: '2024-12-15' },
    { id: 'f2',  elderId: 'e2',  caseId: 'case1', type: 'visit', status: 'scheduled', scheduledDate: '2024-12-21', completedAt: null,               result: '',                                                                       satisfaction: null, nextAction: '评估出院后恢复情况',               assigneeId: 'u6', createdAt: '2024-12-17' },
    { id: 'f3',  elderId: 'e5',  caseId: 'case2', type: 'phone', status: 'scheduled', scheduledDate: '2024-12-23', completedAt: null,               result: '',                                                                       satisfaction: null, nextAction: '了解血糖控制情况',                 assigneeId: 'u5', createdAt: '2024-12-16' },
    { id: 'f4',  elderId: 'e8',  caseId: 'case4', type: 'visit', status: 'completed', scheduledDate: '2024-12-08', completedAt: '2024-12-08',       result: '恢复良好，女儿已安排定期陪护',                                             satisfaction: 5,    nextAction: '下月常规回访',                   assigneeId: 'u5', createdAt: '2024-12-05' },
    { id: 'f5',  elderId: 'e11', caseId: 'case6', type: 'visit', status: 'completed', scheduledDate: '2024-12-12', completedAt: '2024-12-12',       result: '康复训练进行中，左侧肢体活动有所改善',                                       satisfaction: 4,    nextAction: '调整康复方案，两周后复查',        assigneeId: 'u5', createdAt: '2024-12-09' },
    { id: 'f6',  elderId: 'e13', caseId: null,    type: 'phone', status: 'completed', scheduledDate: '2024-12-10', completedAt: '2024-12-10',       result: '身体状况稳定，冬季保暖物资已到位',                                           satisfaction: 5,    nextAction: '下月电话回访',                   assigneeId: 'u7', createdAt: '2024-12-08' },
    { id: 'f7',  elderId: 'e15', caseId: null,    type: 'visit', status: 'missed',    scheduledDate: '2024-12-11', completedAt: null,               result: '未能联系到金婆婆，正在协调同乡志愿者配合',                                     satisfaction: null, nextAction: '协调同乡志愿者再次上门',          assigneeId: 'u6', createdAt: '2024-12-09' },
    { id: 'f8',  elderId: 'e4',  caseId: null,    type: 'phone', status: 'scheduled', scheduledDate: '2024-12-28', completedAt: null,               result: '',                                                                       satisfaction: null, nextAction: '关注冬季呼吸道健康',               assigneeId: 'u7', createdAt: '2024-12-17' },
    { id: 'f9',  elderId: 'e3',  caseId: null,    type: 'phone', status: 'completed', scheduledDate: '2024-12-05', completedAt: '2024-12-05',       result: '健康状况良好，老伴陪伴充足',                                                 satisfaction: 5,    nextAction: '三个月后回访',                   assigneeId: 'u5', createdAt: '2024-12-01' },
    { id: 'f10', elderId: 'e12', caseId: null,    type: 'phone', status: 'scheduled', scheduledDate: '2024-12-27', completedAt: null,               result: '',                                                                       satisfaction: null, nextAction: '了解糖尿病管理情况',               assigneeId: 'u6', createdAt: '2024-12-17' },
  ]

  for (const f of followupsData) {
    await prisma.followupRecord.create({
      data: {
        id: f.id,
        elderId: f.elderId,
        caseId: f.caseId,
        type: f.type,
        status: f.status,
        scheduledDate: new Date(f.scheduledDate),
        completedAt: f.completedAt ? new Date(f.completedAt) : null,
        result: f.result,
        satisfaction: f.satisfaction,
        nextAction: f.nextAction,
        assigneeId: f.assigneeId,
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.createdAt),
      },
    })
  }
  console.log(`  Created ${followupsData.length} followup records`)

  // ════════════════════════════════════════════
  // 9. AuditLogs (14 records)
  // ════════════════════════════════════════════
  const auditsData = [
    { id: 'a1',  actorId: 'u8',  actorName: '周医生',    actorRole: 'hospital_sw', action: '扫描查看',           resourceType: 'emergency_card', resourceId: 'card1',                              ip: '192.168.1.100', isAbnormal: false, createdAt: '2024-12-17T10:23:00' },
    { id: 'a2',  actorId: 'u5',  actorName: '刘社工',    actorRole: 'community',   action: '查看档案',           resourceType: 'elder_profile',  resourceId: 'e2',                                ip: '192.168.1.50',  isAbnormal: false, createdAt: '2024-12-17T09:15:00' },
    { id: 'a3',  actorId: 'u5',  actorName: '刘社工',    actorRole: 'community',   action: '修改档案',           resourceType: 'elder_profile',  resourceId: 'e1',                                ip: '192.168.1.50',  isAbnormal: false, createdAt: '2024-12-17T08:30:00' },
    { id: 'a4',  actorId: 'u6',  actorName: '陈志愿者',  actorRole: 'community',   action: '创建工单',           resourceType: 'task',           resourceId: 't2',                                ip: '192.168.1.51',  isAbnormal: false, createdAt: '2024-12-17T10:05:00' },
    { id: 'a5',  actorId: 'u8',  actorName: '周医生',    actorRole: 'hospital_sw', action: '扫描查看',           resourceType: 'emergency_card', resourceId: 'card2',                              ip: '192.168.1.100', isAbnormal: false, createdAt: '2024-12-17T09:45:00' },
    { id: 'a6',  actorId: 'u12', actorName: '马管理员',  actorRole: 'admin',       action: '导出报表',           resourceType: 'dashboard',      resourceId: 'overview',                           ip: '192.168.1.10',  isAbnormal: false, createdAt: '2024-12-16T17:00:00' },
    { id: 'a7',  actorId: 'u12', actorName: '马管理员',  actorRole: 'admin',       action: '修改角色',           resourceType: 'user',           resourceId: 'u6',                                ip: '192.168.1.10',  isAbnormal: false, createdAt: '2024-12-16T14:20:00' },
    { id: 'a8',  actorId: 'u3',  actorName: '王阿姨',    actorRole: 'family',      action: '查看档案',           resourceType: 'elder_profile',  resourceId: 'e1',                                ip: '192.168.1.200', isAbnormal: false, createdAt: '2024-12-16T10:30:00' },
    { id: 'a9',  actorId: 'u6',  actorName: '陈志愿者',  actorRole: 'community',   action: '多项批量查看',       resourceType: 'elder_profile',  resourceId: 'e1,e2,e3,e4,e5,e6,e7,e8',         ip: '192.168.1.51',  isAbnormal: true,  createdAt: '2024-12-15T23:15:00' },
    { id: 'a10', actorId: 'u11', actorName: '益心公益',  actorRole: 'provider',    action: '查看档案',           resourceType: 'elder_profile',  resourceId: 'e11',                               ip: '192.168.1.150', isAbnormal: false, createdAt: '2024-12-15T14:00:00' },
    { id: 'a11', actorId: 'u5',  actorName: '刘社工',    actorRole: 'community',   action: '生成卡片',           resourceType: 'emergency_card', resourceId: 'card11',                             ip: '192.168.1.50',  isAbnormal: false, createdAt: '2024-12-15T11:00:00' },
    { id: 'a12', actorId: 'u7',  actorName: '赵社工',    actorRole: 'community',   action: '导出档案',           resourceType: 'elder_profile',  resourceId: 'e13',                               ip: '192.168.1.52',  isAbnormal: false, createdAt: '2024-12-14T16:30:00' },
    { id: 'a13', actorId: 'u9',  actorName: '吴护士',    actorRole: 'hospital_sw', action: '扫描查看',           resourceType: 'emergency_card', resourceId: 'card9',                              ip: '192.168.1.101', isAbnormal: false, createdAt: '2024-12-14T09:20:00' },
    { id: 'a14', actorId: 'u6',  actorName: '陈志愿者',  actorRole: 'community',   action: '非工作时间访问',     resourceType: 'elder_profile',  resourceId: 'e15',                               ip: '192.168.1.51',  isAbnormal: true,  createdAt: '2024-12-14T02:10:00' },
  ]

  for (const a of auditsData) {
    await prisma.auditLog.create({
      data: {
        id: a.id,
        actorId: a.actorId,
        actorName: a.actorName,
        actorRole: a.actorRole,
        action: a.action,
        resourceType: a.resourceType,
        resourceId: a.resourceId,
        ip: a.ip,
        isAbnormal: a.isAbnormal,
        createdAt: new Date(a.createdAt),
      },
    })
  }
  console.log(`  Created ${auditsData.length} audit logs`)

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
