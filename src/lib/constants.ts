export const SITE_NAME = '医愿护'
export const SITE_DESCRIPTION = 'AI赋能独居长者医疗医愿建档与照护接续公益系统'
export const SITE_TAGLINE = '让老人关键时刻有人联系、信息可查、照护可接'

export const SERVICE_BOUNDARY = [
  '不代签任何法律文件',
  '不提供医疗诊断',
  '不接触老人财产',
  '不替代依法有权主体作决定',
]

export const SERVICE_CAPABILITIES = [
  { key: 'archive', title: '一档案', desc: '建立老人医疗意愿与照护偏好档案，AI辅助整理关键信息' },
  { key: 'card', title: '一张卡', desc: '生成安心联系卡，扫码即可获取紧急联系信息' },
  { key: 'summary', title: '一摘要', desc: 'AI生成意愿摘要，人工核验确认，关键信息一目了然' },
  { key: 'response', title: '一响应', desc: '应急事件触发，自动通知联系人与社区工作人员' },
  { key: 'continuity', title: '一接续', desc: '出院照护接续，安排接送、复诊、用药提醒与回访' },
]

export const ROLE_LABELS: Record<string, string> = {
  elderly: '老人本人',
  family: '家属/可信联系人',
  community: '社区社工/志愿者',
  hospital_sw: '医院社工',
  provider: '护理合作资源',
  admin: '管理员/督导',
}

export const TASK_STATUS_LABELS: Record<string, string> = {
  todo: '待办',
  in_progress: '进行中',
  done: '已完成',
  overdue: '已超时',
  cancelled: '已取消',
}

export const PROFILE_STATUS_LABELS: Record<string, string> = {
  draft: '草稿',
  pending_confirm: '待确认',
  completed: '已完成',
  expired: '已过期',
}

export const CASE_STATUS_LABELS: Record<string, string> = {
  open: '处理中',
  resolved: '已解决',
  closed: '已关闭',
  escalated: '已上报',
}

export const PRIORITY_LABELS: Record<number, string> = {
  1: '低',
  2: '中',
  3: '高',
  4: '紧急',
}

export const FAQ_DATA = [
  {
    q: '什么是"医愿护"？',
    a: '医愿护是一个AI辅助的公益系统，帮助独居长者建立医疗意愿档案、生成安心联系卡、在突发情况时快速联系家人和社区工作人员，以及协助出院后的照护接续。我们不提供医疗服务，只做信息支持和照护协调。',
    cat: 'general',
  },
  {
    q: '我的隐私会得到保护吗？',
    a: '是的。我们采用分层授权机制：扫码的公开页面只显示最小必要信息；完整档案仅相关工作人员可见；所有查看、修改操作都会留下审计记录。我们严格遵守《个人信息保护法》关于敏感个人信息的规定。',
    cat: 'privacy',
  },
  {
    q: '如何使用安心联系卡？',
    a: '完成建档后，系统会为您生成一张带有二维码的安心联系卡。您可以将卡放在钱包或家门附近。在突发就医时，医院社工扫描二维码即可看到您的紧急联系人和基本照护偏好，快速联系到您的家人。',
    cat: 'card',
  },
  {
    q: '谁来填写档案？我不会用手机怎么办？',
    a: '我们有多种建档方式：您可以自己填写（支持语音录入），也可以由家属协助填写，或由社区工作人员上门协助建档。我们还会定期对档案进行回访更新，确保信息准确。',
    cat: 'intake',
  },
  {
    q: '这个服务收费吗？',
    a: '医愿护是纯公益项目，不向老人和家属收取任何费用。项目由学校大创计划支持，后续将争取社会公益基金持续运营。',
    cat: 'general',
  },
  {
    q: '如何成为志愿者？',
    a: '您可以在"加入我们"页面提交志愿者报名信息，或直接联系项目团队。我们会提供标准化的培训，包括服务流程、隐私保护和沟通规范。',
    cat: 'general',
  },
  {
    q: 'AI生成的摘要准确吗？',
    a: 'AI只负责生成摘要草稿，所有内容都必须经过人工核验和本人或家属确认后才能归档。我们保留每一次修改的版本记录，确保信息准确可追溯。',
    cat: 'intake',
  },
  {
    q: '我的信息可以修改或删除吗？',
    a: '当然可以。您可以随时联系社区工作人员更新您的档案信息。如需删除信息，请联系我们的管理员，我们将按照相关规定处理您的请求。',
    cat: 'privacy',
  },
]

export const SCENARIOS = [
  {
    icon: 'hospital',
    title: '突发入院',
    desc: '老人突发疾病被送往医院，医院社工扫描安心联系卡上的二维码，立即获取紧急联系人和照护偏好，第一时间通知家属。',
  },
  {
    icon: 'communication',
    title: '住院沟通',
    desc: '家属远程了解老人的照护意愿和偏好，协助医护人员更好地理解老人的需求，减少沟通障碍。',
  },
  {
    icon: 'discharge',
    title: '出院接续',
    desc: '系统根据出院小结生成接续照护计划，安排接送、复诊提醒、用药指导和定期回访。',
  },
  {
    icon: 'followup',
    title: '回访更新',
    desc: '社区工作人员定期回访，更新档案信息，确认联系人有效性，确保紧急信息始终准确。',
  },
]
