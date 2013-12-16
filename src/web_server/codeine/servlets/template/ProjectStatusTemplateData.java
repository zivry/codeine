package codeine.servlets.template;

import java.util.List;

import codeine.servlet.TemplateData;
import codeine.utils.network.HttpUtils;
import codeine.version.VersionItemTemplate;

@SuppressWarnings("unused")
public class ProjectStatusTemplateData extends TemplateData {
	
	private List<VersionItemTemplate> version;
	private List<NameAndAlias> commands;
	private int total;
	private String monitors_chart_data_json;
	private String project_name;
	private String project_name_encoded;
	private boolean readonly;
	
	
	public ProjectStatusTemplateData(String projectName, List<VersionItemTemplate> version, String monitors_chart_data_json, int total, List<NameAndAlias> commands, boolean readOnly) {
		super();
		this.project_name = projectName;
		this.project_name_encoded = HttpUtils.encode(projectName);
		this.monitors_chart_data_json = monitors_chart_data_json;
		this.version = version;
		this.total = total;
		this.commands = commands;
		this.readonly = readOnly;
	}

}