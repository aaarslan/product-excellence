# Source and attribution

This is an isolated local study of [shancarter/mr-data-converter](https://github.com/shancarter/mr-data-converter), pinned to commit [`e5d6cb616eafe2d16beb6c7f0399d7ca5c142304`](https://github.com/shancarter/mr-data-converter/tree/e5d6cb616eafe2d16beb6c7f0399d7ca5c142304). The commit is dated 2014-08-27. The study does not imply active maintenance, present-day customer demand, author endorsement, or an upstream contribution.

The source was retrieved through read-only GitHub file access. Text snapshots have normalized terminal newlines; this does not change application behavior. Original files and comparison copies are retained with their recorded snapshot hashes. The original application and attribution are not claimed as this project's invention.

- `upstream/`: unmodified application behavior, including original libraries and assets, under its retained `LICENSE.md` (MIT, copyright 2011 Shan Carter).
- `control/`: task-only agent implementation.
- `skill-trial/`: frozen skill-assisted implementation, including its subsequently discovered numeric precision regression.
- `demonstrator/`: separately corrected skill-assisted implementation. Do not confuse its repaired outcome with the original paired result.
- `evidence/`: task, pre-run criteria, frozen skill, raw observations, independent checks/judgments and browser screenshots. All entered data is synthetic. Screenshots contain the local application, not personal browser chrome.

Bundled dependencies remain under their original terms, not Abdallah Arslan's copyright:

- jQuery 1.6.1 and Sizzle retain their source notices. The [version-specific MIT license](https://github.com/jquery/jquery/blob/1.6.1/MIT-LICENSE.txt) is included in `licenses/JQUERY-LICENSE.txt`.
- The CSS reset retains Yahoo's 2010 YUI 3.1.2 BSD notice. The BSD terms from the [YUI repository](https://github.com/yui/yui3/blob/master/LICENSE.md) are also included in `licenses/YUI-LICENSE.txt`; its later notice does not replace the original notice in the CSS.
- The attributed Ben Nadel CSV utility remains in the original parser file. The evaluated implementations use a separately authored strict field reader, leaving the original attribution intact.

No source comments, attribution or legal notices were stripped to claim new authorship. The study added no source comments/docstrings, dependencies, CI workflows, upstream writes, customer data, or paid model API calls. Demo code includes legacy dependencies and is not presented as a security-hardened production fork.
